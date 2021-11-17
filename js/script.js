// Load next slide when user presses continue button
$.fn.nextSlideOnArrow = function (arrow) {
    // make sure anchor (hash) is provided before overriding default behavior
    if (arrow.attr('link') !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        var cur = arrow.parent().parent(); // current slide
        var next = cur.next(); // next slide

        arrow.addClass("hide");
        cur.addClass("clicked");
        next.removeClass("hide");

        // store hash
        var hash = arrow.attr('link');

        // using jQuery's animate() method to add smooth page scroll
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, function () {
            // add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });

        if (arrow.attr('update') !== "") {
            setTimeout(() => {
                // update mastery bar
                var newProg = arrow.attr('update');
                $("#progress").css("width", newProg + "%");
                $("#you-label").css("left", newProg + "%");
                $("#you-label").html("&larr; You (0." + newProg + ")");
            }, 1000);
        }

        if (next.hasClass("last-slide")) {
            if (!next.hasClass("has-reveal")) {
                // if on last slide of page, reveal continue button
                setTimeout(() => {
                    $(".next-page").removeClass("hide");
                }, 3000);
            }
            if ($(document.body).hasClass("reveal-mastery")) {
                // reveal mastery bar
                setTimeout(() => {
                    $("#mastery").removeClass("hide");
                }, 2000);
            }
        }

        if (next.hasClass("no-reveal")) {
            // reveal continue button automatically if no reveal
            setTimeout(() => {
                $('.no-reveal .continue').removeClass("hide");
            }, 5000);
        }
    }
}

// Load next slide after user submits answer
$.fn.nextSlideOnInput = function (input, button, output) {
    if (input.val() == '') { // check for user input
        alert('Please enter a ' + output.attr('id') + '.');
        return;
    }

    input.blur(); // unfocus cursor
    var o = input.val(); // user's input
    var c = input.parent().parent().parent(); // current slide

    // fade current slide and reveal next slide
    c.addClass("clicked");
    output.html(output.html() + o);
    c.next().removeClass("hide");

    // make sure anchor (hash) is provided before overriding default behavior
    if (button.attr('link') !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // store hash
        var hash = button.attr('link');

        // using jQuery's animate() method to add smooth page scroll
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, function () {
            // add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
    }
}

// reveal rest of slide on button click
$.fn.revealRest = function (button) {
    var container = button.parent();
    if (container.hasClass("slider-all") || container.hasClass("fill-in-blanks")) {
        // slider or fill in the blanks question
        container.addClass("clicked");
    } else {
        button.addClass("clicked");
    }

    var rest = container.next(); // rest of slide
    rest.removeClass("hide");

    var section = container.parent().parent(); // section
    if (section.hasClass("last-slide")) {
        // if on last slide of page, reveal next button
        setTimeout(() => {
            $(".next-page").removeClass("hide");
        }, 3000);
    } else {
        var cont = rest.next(); // continue button
        if (cont.length == 0) {
            cont = rest.parent().next();
        }
        setTimeout(() => {
            cont.removeClass("hide");
        }, 3000);
    }
}

// reveal answer to multiple choice
$.fn.revealRestMC = function (button) {
    var rest = button.parent().parent().next(); // rest of slide
    var ans = rest.children()[0]; // answer

    if (button.hasClass("radio-reveal")) { // for radio butotn questions
        rest = button.parent().next();
        ans = rest.children()[0];
        var choice = $(".radio-choice input[type='radio']:checked")[0];
        if (choice == null) { // check for user input
            alert('Please select an option.');
            return;
        }
        if (choice.getAttribute("correct") == "no") { // user wrong
            ans.innerHTML = "Actually" + ans.innerHTML.substring(3);
        }
    } else {
        if (button.attr("correct") == "no") { // user wrong
            ans.innerHTML = "Actually" + ans.innerHTML.substring(3);
        }
    }

    button.addClass("selected");
    button.parent().addClass("clicked");
    rest.removeClass("hide");

    var slide = rest.parent().parent(); // current slide
    if (!slide.hasClass("has-reveal")) {
        var cont = rest.next(); // continue button
        setTimeout(() => {
            cont.removeClass("hide");
        }, 3000);
    } else if (slide.hasClass("last-slide")) {
        // if on last slide of page, reveal continue button
        setTimeout(() => {
            $(".next-page").removeClass("hide");
        }, 3000);
    }
}

// update slider value
$.fn.updateSlider = function (slider) {
    // get parameter name
    var param = slider.attr('id');
    param = param.substring(0, param.indexOf('-'));

    // get slider value
    var val = slider.val();

    // update label
    $('#' + param + '-prob')[0].innerHTML = val;
}

// validate user answers to questions
$.fn.validateForm = function (button) {
    var correct = true;
    var form = button.parent();
    $('#' + form.attr('id') + ' select').not('.correct').each(function () {
        var q = $(this);
        if (q.attr('correct') == q.val()) { // correct answer
            q.addClass('correct clicked');
            q.removeClass('wrong');
        } else { // wrong answer
            q.addClass('wrong');
            correct = false;
        }
    });

    if (!correct) { // ask user to try again
        alert('Almost there! Please correct the questions outlined in red.');
        return;
    }

    // otherwise all correct and can move on!
    // fade current slide and reveal next slide
    form.addClass("clicked");
    var n = form.parent().parent().parent().next();
    n.removeClass("hide");

    // make sure anchor (hash) is provided before overriding default behavior
    if (button.attr('link') !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // store hash
        var hash = button.attr('link');

        // using jQuery's animate() method to add smooth page scroll
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, function () {
            // add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
    }

    if (button.attr('update') !== "") {
        setTimeout(() => {
            // update mastery bar
            var newProg = button.attr('update');
            $("#progress").css("width", newProg + "%");
            $("#you-label").css("left", newProg + "%");
            $("#you-label").html("&larr; You (0." + newProg + ")");
        }, 1000);
    }
}

// validate form and reveal rest of slide
$.fn.validateReveal = function (button) {
    var form = button.parent();
    var valid = true;
    var unique = new Set(); // store unique answers

    $('#' + form.attr('id') + ' select').each(function () {
        var val = $(this).val();
        if (unique.has(val)) { // duplicate answer
            valid = false;
            alert(form.attr('message'));
            return;
        }
        unique.add(val); // add to set
    });

    if (valid) {
        $.fn.revealRest(button); // if valid, reveal rest of slide
    }
}

// validate fill in blanks and reveal rest of slide
$.fn.blankReveal = function (button) {
    var correct = true;
    var form = button.parent();
    $('#' + form.attr('id') + ' select').not('.correct').each(function () {
        var q = $(this);
        if (q.attr('correct') == q.val()) { // correct answer
            q.addClass('correct clicked');
            q.removeClass('wrong');
        } else { // wrong answer
            q.addClass('wrong');
            correct = false;
        }
    });

    if (!correct) { // ask user to try again
        alert('Almost there! Please correct the questions outlined in red.');
        return;
    }
    
    $.fn.revealRest(button); // if valid, reveal rest of slide
}

// expand/collaspe content
$.fn.toggleContent = function (button) {
    var content = button.next();
    content.toggleClass("hide"); // toggle content visibility

    button.toggleClass("active"); // toggle state of button too
    var symbol = button.children()[0];
    if (symbol.innerHTML == '+') {
        symbol.innerHTML = '-';
    } else {
        symbol.innerHTML = '+';
    }
}

$(document).ready(function () {
    $('.one-input .button').on('click', function () { // user clicked submit button
        var answer = $(this).prev();
        var guess = answer.attr('output');
        $.fn.nextSlideOnInput(answer, $(this), $(guess));
    });

    $('.one-input .text').keypress(function (e) { // user pressed enter
        if (e.which == 13) {
            var button = $(this).next();
            var guess = $(this).attr('output');
            $.fn.nextSlideOnInput($(this), button, $(guess));
        }
    });

    $('.continue').on('click', function () { // user pressed continue button
        $.fn.nextSlideOnArrow($(this));
    })

    $('.reveal').on('click', function () { // reveal rest of slide
        $.fn.revealRest($(this));
    });

    $('.next-page').on('click', function () { // user pressed next page button
        $(this).addClass("clicked");
        $('.last-slide').addClass("clicked");
    });

    $('.button.choice').on('click', function () { // user answered multiple choice
        $.fn.revealRestMC($(this));
    });

    setTimeout(() => { // show continue arrow automatically on first slide
        $('.auto-cont .continue').removeClass("hide");
    }, 5000);

    $('.sliders.test .slider').change(function () { // update slider value
        $.fn.updateSlider($(this));
    })

    $('.button.validate').on('click', function () { // validate user answers
        $.fn.validateForm($(this));
    })

    $('.button.val-reveal').on('click', function () { // validate form and reveal
        $.fn.validateReveal($(this));
    })

    $('.button.blank-reveal').on('click', function () { // validate fill in the blanks and reveal
        $.fn.blankReveal($(this));
    })

    $('.expand').on('click', function () {
        $.fn.toggleContent($(this)); // expand/collapse content
    })
});
