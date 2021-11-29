$(document).ready(function () {
    // FUNCTIONS
    // prepare to start test
    $.fn.loadTest = function () {
        var firstSlide = null;
        $('section').each(function () {
            if ($(this).hasClass("start-test")) { // first slide
                $(this).removeClass("hide clicked");
                firstSlide = $(this);
            } else { // others
                $(this).addClass("hide");
            }
        })

        $('#mini-mastery').removeClass('hide'); // show mini mastery bar

        // activate param sliders
        $('.slider-param-label').each(function () {
            $(this).removeClass('inactive');

            // update html
            var html = $(this).html();
            var param = $(this).attr("param");
            $(this).html(param + " / " + html);

        });


        // refresh first slide
        $('.slider-container').removeClass('clicked');
        $('#test-text').html("Okay, let's see how fast you can get to mastery! <i>Note: this simulation uses a separate mastery bar (below). Your overall mastery bar won't be affected.</i>");

        // update right side content
        $('#q6').removeClass("fill-in-blanks clicked");
        $('#q6').addClass("test");
        $('#b6').addClass("hide");
        $('#b7').removeClass("hide");
        $('#test-instruct').html("<i>Choose some parameter settings by adjusting the sliders on the right. Press start when you're ready to begin!</i>");
        $('#test-instruct').addClass("no-space");
        $('#match-grid').addClass("hide");
        $('#q6').prependTo("#test-screen");
        $('#test-screen').addClass("test");


        setTimeout(() => {
            $('#mastery').addClass('clicked'); // freeze main mastery bar

            var hash = '#' + firstSlide.attr('id');
            // using jQuery's animate() method to add smooth page scroll
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, function () {
                // add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        }, 500);
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

    // load new question
    $.fn.loadQuestion = function () {
        var word = "hello  ";
        var letter = $('#test-img');

        var i = 0; // index
        var char = word.charAt(i);
        var newImg = "gif/letters/" + char + ".gif";
        letter.attr("src", newImg);

        setInterval(function () { // loop letters
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

    // start test!
    $.fn.startTest = function () { 
        $('.slider-container').addClass('clicked');
        $('.param-desc').addClass('hide');
        $.fn.loadQuestion();

        $('#b7').addClass("hide");
        $('#test-instruct').addClass("hide");
        $('.test-q').removeClass('hide');
    }


    // CALL FUNCTIONS
    $('.load-test').on('click', function () { // reload test
        $.fn.loadTest();
    })

    $('.sliders.test .slider').change(function () { // update slider value
        $.fn.updateSlider($(this));
    })

    $('.button.begin').on('click', function () { // start test
        $.fn.startTest();
    })
});