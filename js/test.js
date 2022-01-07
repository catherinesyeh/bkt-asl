$(document).ready(function () {
    // FUNCTIONS
    // change instructions before test
    $.fn.prepInstructions = function () {
        $('#congrats-msg').addClass("hide");

        // load instructions again
        $('#q6').removeClass("fill-in-blanks clicked");
        $('#q6').addClass("test");
        $('#b6').addClass("hide");
        $('#b7').removeClass("hide");
        $('#test-instruct').removeClass("hide");
        $('#test-instruct').html("<i>Choose some parameter settings by adjusting the sliders on the right. Press start when you're ready to begin!</i>");
        $('#test-instruct').addClass("no-space");
        $('#match-grid').addClass("hide");
        $('#q6').prependTo("#test-screen");
        $('#test-screen').addClass("test");

        // reset mastery
        var init_label = $('#mini-mastery #progress span').first();
        $("#mini-mastery #progress").css("width", "25%");
        init_label.html("<b>P(init):</b> 0.25");

        // set up sliders
        $('.slider-container').removeClass('clicked');
        $('.param-desc').removeClass('hide');
    }

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

        // update left side content
        $.fn.prepInstructions();


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

    var newWord = null;
    var speed = 500;
    var word_list = words;
    var tested_words = [];

    // load new question
    $.fn.loadQuestion = function () {
        var input = $('.test-q .text').first();
        var button = $('.test-q .button').first();

        // reset form
        input.val(''); // empty guess field
        input.removeClass("wrong correct clicked");
        button.attr("value", "Submit guess!");
        button.attr("title", "Submit guess!");
        button.removeClass("next wrong correct");

        if (tested_words.length == word_list.length) {
            tested_words = []; // empty tested list if already used up all words
        }

        // choose random word
        var word = word_list[Math.floor(Math.random() * word_list.length)];
        while (tested_words.includes(word)) { // make sure word hasn't been tested before
            word = word_list[Math.floor(Math.random() * word_list.length)];
        }
        tested_words.push(word); // add word to already tested list

        // time to spell word
        var letter = $('#test-img');
        letter.next().next().attr("ans", word); // store word as answer
        word += " ";

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
        }, speed);
    }

    // find range slip/guess prob falls in
    $.fn.getIndex = function (prob) {
        const max_ind = ranges.length;
        for (var i = 0; i < max_ind; i++) {
            if (prob < ranges[i]) {
                return max_ind - i;
            }
        }
        return 0;
    }

    // start test!
    $.fn.startTest = function () { 
        $('.slider-container').addClass('clicked');
        $('.param-desc').addClass('hide');

        // get param values
        var slip = $('#slip-slider').val();
        var guess = $('#guess-slider').val();
        var transit = $('#transit-slider').val();

        tested_words = [] // reset list of already tested words
        word_list = words; // reset list of possible words
        speed = 200 + transit * 1000; // adjust speed of signing

        // filter list of words depending on slip and guess values
        // higher guess = more familiar letters
        var mismatch = $.fn.getIndex(guess);
        word_list = word_list.filter(word => famWord(word, mismatch));

        // higher slip = more similar letters
        avoid_list = []; // reset list of letters to avoid
        var sim = $.fn.getIndex(slip);
        avoidLetters(sim); // choose which letters to avoid accordingly
        word_list = word_list.filter(word => simWord(word));

        // load first question
        $.fn.loadQuestion();

        $('#b7').addClass("hide");
        $('#test-instruct').addClass("hide");
        $('.test-q').removeClass('hide');
    }

    // update mastery
    $.fn.updateMastery = function (correct) {
        clearInterval(newWord);
        // get param values
        var init_label = $('#mini-mastery #progress span').first();
        var init = parseFloat(init_label.html().split("</b>").pop());
        var slip = $('#slip-slider').val();
        var guess = $('#guess-slider').val();
        var transit = $('#transit-slider').val();

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

        setTimeout(() => {
            if (newProg >= 0.95) { // acheived mastery!
                $('.test-q').first().addClass("hide");
                $('#congrats-msg').removeClass("hide");
                alert('You did it! Congrats on achieving mastery!')
                return;
            } // else, continue
        }, 1000);
    }

    // check answer and update mastery
    $.fn.checkAnswer = function (button) {
        var input = button.prev();
        var val = input.val().toLowerCase();
        if (val == '') { // check for user input
            alert('Please enter a guess.');
            return;
        }

        input.blur(); // unfocus cursor
        // is answer correct?
        var ans = input.attr("ans");
        var correct = true;
        if (val == ans) { // yes
            input.addClass("correct clicked");
            button.addClass("correct");
            alert('Correct!');
        } else { // no
            input.addClass("wrong clicked");
            button.addClass("wrong");
            correct = false;
            alert('Sorry, that is incorrect. The answer was: ' + ans + '.');
        }

        $.fn.updateMastery(correct); // update mastery

        button.attr("value", "Next >");
        button.attr("title", "Next");
        button.addClass("next");
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

    $('.button.test').on('click', function () { // check user answer
        if ($(this).hasClass("next")) {
            $.fn.loadQuestion(); // load next question
        } else {
            $.fn.checkAnswer($(this));
        }
    })

    $('.test-q input.text').keypress(function (e) { // user pressed enter
        if (e.which == 13) {
            e.preventDefault();
            $.fn.checkAnswer($(this).next());
        }
    });

    $('.button.again').on('click', function () { // reload test after 1st time
        $.fn.prepInstructions();
    })

    $('.button.cont').on('click', function () { // go to next page
        $('#match-params').addClass("clicked");
    })
});