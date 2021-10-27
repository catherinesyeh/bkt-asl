// Load next slide when user presses continue button
$.fn.nextSlideOnArrow = function(arrow) {
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
      }, function(){
         // add hash (#) to URL when done scrolling (default click behavior)
         window.location.hash = hash;
      });

       if (next.hasClass("last-slide")) {
          setTimeout(() => {
              $(".next-page").removeClass("hide");
          }, 3000);
      }
   }
}

// Load next slide after user submits answer
$.fn.nextSlideOnInput = function(input, button, output) {
    if (input.val() == '') {
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
      }, function(){
         // add hash (#) to URL when done scrolling (default click behavior)
         window.location.hash = hash;
      });
   }
}

// reveal rest of slide on button click
$.fn.revealRest = function(button) {
   var container = button.parent();
    if (container.hasClass("slider-all")) {
        container.addClass("clicked");
    } else {
        button.addClass("clicked");
    }

   var rest = container.next();
   rest.removeClass("hide");

   var cont = rest.next();
   setTimeout(() => {
       cont.removeClass("hide");
   }, 3000);
}

$(document).ready(function() { // user clicked submit button
    $('.one-input .button').on('click', function (event) {
        var answer = $(this).prev();
        var guess = answer.attr('output');
      $.fn.nextSlideOnInput(answer, $(this), $(guess));
   });

    $('.one-input .text').keypress(function(e) { // user pressed enter
       if (e.which == 13) {
           var button = $(this).next();
           var guess = $(this).attr('output');
         $.fn.nextSlideOnInput($(this), button, $(guess));
      }
   });

   $('.continue').on('click', function(event) { // user pressed continue button
      $.fn.nextSlideOnArrow($(this));
   })

   $('.reveal').on('click', function(event) { // reveal rest of slide
      $.fn.revealRest($(this));
   });

   $('.next-page').on('click', function (event) { // user pressed next page button
       $(this).addClass("clicked");
       $('.last-slide').addClass("clicked");
   })
});
