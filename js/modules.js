$(document).ready(function () {
    // FUNCTIONS
    $.fn.freezeMastery = function (button) {
        // get id of current button
        var mod = button.attr('id');
        mod = mod.substring(0, mod.indexOf('-'));

        var parent = button.parent().parent().parent().parent();
        parent.addClass("clicked");

        setTimeout(() => {
            $('#mastery').addClass('clicked'); // freeze main mastery bar

            var hash = '#' + mod + "-mod";
            $(hash).removeClass("hide");

            // using jQuery's animate() method to add smooth page scroll
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, function () {
                // add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        }, 500);
    }

    var newWord = null;
    $.fn.incMod = function () {
        var word = $('#mc-question').attr('word'); // get word
        word += "  ";
        var letter = $('#test-img');

        var i = 0; // index
        var char = word.charAt(i);
        var newImg = "gif/letters/" + char + ".gif";
        letter.attr("src", newImg);

        newWord = setInterval(function () { // loop letters
            i++;
            if (i == word.length) {
                i = 0;
            }
            char = word.charAt(i);

            if (char == " ") { // add extra blank to designate start of word
                char = "blank";
            }

            newImg = "gif/letters/" + char + ".gif";
            letter.attr("src", "gif/letters/blank.gif");
            setTimeout(() => {
                letter.attr("src", newImg);
            }, 100);
        }, 800);
    }

    $.fn.updateMastery = function (label, correct, slip, guess, transit) {
        // get param values
        var init_label = $('#mini-mastery.' + label + ' #progress span').first();
        var init = parseFloat(init_label.html().split("</b>").pop());

        var p = init;
        if (correct) { // user answered correctly
            p = (init * (1 - slip)) / (init * (1 - slip) + (1 - init) * guess);
        } else { // user answered incorrectly
            p = (init * slip) / (init * slip + (1 - init) * (1 - guess));
        }
        var newProg = p + (1.0 - p) * transit;
        newProg = newProg.toFixed(2); // round to 2 decimal places

        // update mastery bar
        $("#mini-mastery." + label + " #progress").css("width", (newProg * 100) + "%");
        init_label.html("<b>P(init):</b> " + newProg);
    }

    $.fn.updateMenu = function (button) {
        var mod = button.attr('mod'); // find out which module this is
        var menu = $('#mod-menu');
        var hash = '#' + menu.attr('id');
        var prog = $("#you-label");
        var complete = parseFloat($('#complete-mods').html());
        complete += 1;

        setTimeout(() => {
            $('#mastery').removeClass('clicked'); // unfreeze main mastery bar
            menu.removeClass("clicked"); // unfreeze menu

            // hide all slides for this module
            $("section[mod='" + mod + "']").addClass('hide');

            // go back to top
            // using jQuery's animate() method to add smooth page scroll
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, function () {
                // add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });

            // mark module as complete
            var module = $(".module[mod='" + mod + "']").first();
            $(".module span[mod='" + mod + "']").html('Completed');
            module.addClass('clicked');

            // update mastery bar
            var oldProg = prog.attr('style');
            oldProg = oldProg.substring(oldProg.indexOf(':') + 1, oldProg.indexOf('%'));
            oldProg = parseFloat(oldProg);

            var newProg = oldProg + 10;
            $("#progress").css("width", newProg + "%");
            prog.css("left", newProg + "%");
            prog.html("<span>&larr;</span> You (0." + newProg + ")");

            // update module tracker
            $('#complete-mods').html(complete);

            setTimeout(() => {
                if (complete == 4) { // user reached mastery
                    alert("Congratulations! You've achieved mastery. After exiting this pop-up, press the next button to continue.");
                    $(".next-page").removeClass("hide");
                }
            }, 500);
        }, 500);
    }

    $.fn.simulateUnexp = function (button) {
        var slip = $('#slip-slider').val();
        var guess = $('#guess-slider').val();

        if (button.attr('degen') == 'no') { // normal param values
            if (slip >= 0.5 || guess >= 0.5) {
                alert('Please make sure P(slip) and P(guess) are < 0.5.');
                return false;
            }
        } else { // degenerate values
            if (slip <= 0.5 || guess <= 0.5) {
                alert('Please make sure P(slip) and P(guess) are > 0.5.');
                return false;
            }
        }

        setTimeout(() => {
            $.fn.updateMastery("correct", true, slip, guess, 0.5);
            $.fn.updateMastery("incorrect", false, slip, guess, 0.5);

            var parent = button.parent();
            parent.addClass('hide');

            parent.next().removeClass('hide');
        }, 500);
    }

    $.fn.reloadUnexp = function () {
        // make some modifications
        $('#unexp-q .button.choice').addClass('mc');
        $('.reload-unexp').addClass('hide');
        $('#unexp-q .init-ans').addClass('hide');
        $('#unexp-q .buttons').removeClass('clicked');
        $('#unexp-q .button').removeClass('selected');

        // change correct answer
        $('#unexp-q #correct').attr('correct', 'no');
        $('#unexp-q #incorrect').attr('correct', 'yes');
        $('#unexp-q .unexp-a').html('incorrect');

        // reset answer text
        var ans_msg = $('#unexp-q .reveal-ans').html();
        ans_msg = "Yes" + ans_msg.substring(ans_msg.indexOf(","));
        $('#unexp-q .reveal-ans').html(ans_msg);
        $('#unexp-q').addClass('hide');

        $('#unexp-word').html('Now');
        $('#unexp-direction').html('&gt; 0.5');
        $('#unexp-slide #sim').attr('degen', 'yes');
        $('#unexp-slide').removeClass('hide');

        // reset mini mastery bars
        $('#mini-mastery #progress span').each(function () {
            $(this).first().html("<b>P(init):</b> 0.40");
        });
        $("#mini-mastery #progress").css("width", "40%");
    }

    $.fn.validateQ = function () { // validate user answer + go to next slide
        var input = $('#forget-input');
        var time = $('#forget-select').val();
        var num = input.val();
        if (num == null || num == '' || isNaN(parseInt(num))) { // check for valid user input
            alert('Please enter a number.');
            return false;
        } else if (time == null || time == '') {
            alert('Please choose an option from the dropdown menu.');
            return false;
        }

        // get user guess
        var guess = num + ' ' + time;
        var output = $(input.attr('output'));
        var next_slide = output.parent().parent();
        var this_slide = next_slide.prev();

        // fade current slide and reveal next slide
        this_slide.addClass("clicked");
        output.html(output.html() + guess);
        next_slide.removeClass("hide");

        // store hash
        var hash = '#' + next_slide.attr('id');

        // using jQuery's animate() method to add smooth page scroll
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, function () {
            // add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });

    }

    // CALL FUNCTIONS
    $('.return-to-menu').on('click', function () { // update module menu
        $.fn.updateMenu($(this));
    })

    $('#incorrect-button').on('click', function () { // load 'incorrect answers' module
        $.fn.freezeMastery($(this)); // freeze mastery bar
        $.fn.incMod(); // start module
    })

    $('#unexpected-button').on('click', function () { // load 'unexpected behavior' module
        $.fn.freezeMastery($(this)); // freeze mastery bar
    })

    $('#forgetting-button').on('click', function () { // load 'forgetting' module
        $.fn.freezeMastery($(this)); // freeze mastery bar
    })

    $('#speed-button').on('click', function () { // load 'speed' module
        $.fn.freezeMastery($(this)); // freeze mastery bar
    })

    $('.button.choice.mc').on('click', function () { // user answered multiple choice
        clearInterval(newWord); // simulate wrong answer
        setTimeout(() => {
            $.fn.updateMastery("mc", false, 0.1, 0.1, 0.5);
        }, 500);
    });

    $('.button.simulate').on('click', function () { // simulating unexpected answers
        $.fn.simulateUnexp($(this));
    })

    $('.link.reload-unexp').on('click', function () { // reload unexpected sliders
        $.fn.reloadUnexp();
    })

    $('.sliders.test .slider').change(function () { // update slider value
        $.fn.updateSlider($(this));
    })

    $('.button.next-q').on('click', function () { // load next question
        var parent = $(this).parent();
        setTimeout(() => {
            parent.addClass('hide');
            parent.next().removeClass('hide');
        }, 500);
    })

    $('.button.val-next').on('click', function () { // validate and go to next slide
        $.fn.validateQ();
    })
});