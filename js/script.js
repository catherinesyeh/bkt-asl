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
    if (container.hasClass("slider-all")) { // slider question
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
    button.addClass("selected");
    button.parent().addClass("clicked");

    var rest = button.parent().parent().next(); // rest of slide
    var ans = rest.children()[0]; // answer

    if (button.attr("correct") == "no") { // user wrong
        ans.innerHTML = "Actually" + ans.innerHTML.substring(3);
    }
    rest.removeClass("hide");

    var slide = rest.parent().parent(); // current slide
    if (!slide.hasClass("has-reveal")) {
        var cont = rest.next(); // continue button
        setTimeout(() => {
            cont.removeClass("hide");
        }, 3000);
    }
}

$(document).ready(function () {
    $('.one-input .button').on('click', function (event) { // user clicked submit button
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

    $('.continue').on('click', function (event) { // user pressed continue button
        $.fn.nextSlideOnArrow($(this));
    })

    $('.reveal').on('click', function (event) { // reveal rest of slide
        $.fn.revealRest($(this));
    });

    $('.next-page').on('click', function (event) { // user pressed next page button
        $(this).addClass("clicked");
        $('.last-slide').addClass("clicked");
    });

    $('.button.choice').on('click', function (event) { // user answered multiple choice
        $.fn.revealRestMC($(this));
    });

    setTimeout(() => {
        $('.auto-cont .continue').removeClass("hide");
    }, 5000);
});
