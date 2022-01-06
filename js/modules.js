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
        }, 500);
    }

    $.fn.updateMastery = function (correct, slip, guess, transit) {
        // get param values
        var init_label = $('#mini-mastery #progress span').first();
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
        $("#mini-mastery #progress").css("width", (newProg * 100) + "%");
        init_label.html("<b>P(init):</b> " + newProg);
    }

    $.fn.updateMenu = function (button) {
        var mod = button.attr('mod'); // find out which module this is
        var menu = $('#mod-menu');
        var hash = '#' + menu.attr('id');
        var prog = $("#you-label");

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
            $("span[mod='" + mod + "']").html('Completed');
            module.addClass('clicked');

            // update mastery bar
            var oldProg = prog.attr('style');
            oldProg = oldProg.substring(oldProg.indexOf(':') + 1, oldProg.indexOf('%'));
            oldProg = parseFloat(oldProg);

            var newProg = oldProg + 10;
            $("#progress").css("width", newProg + "%");
            prog.css("left", newProg + "%");
            prog.html("&larr; You (0." + newProg + ")");

            // update module tracker
            var complete = parseFloat($('#complete-mods').html());
            $('#complete-mods').html(complete + 1);
        }, 500);
    }

    // CALL FUNCTIONS
    $('.return-to-menu').on('click', function () { // update module menu
        $.fn.updateMenu($(this));
    })

    $('#incorrect-button').on('click', function () { // load 'incorrect answers' module
        $.fn.freezeMastery($(this)); // freeze mastery bar
        $.fn.incMod(); // start module
    })

    $('.button.choice.mc').on('click', function () { // user answered multiple choice
        clearInterval(newWord); // simulate wrong answer
        setTimeout(() => {
            $.fn.updateMastery(false, 0.1, 0.1, 0.5);
        }, 500);
    });
});