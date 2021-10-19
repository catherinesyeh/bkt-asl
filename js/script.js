// INTRO / P(GUESS)
var a1 = $("#a1");
var b1 = $("#b1");
var guess = $("#guess");
var reveal = $("#reveal-bkt");
var answer = $("#bkt-answer");

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
   }
}

// Load next slide after user submits answer
$.fn.nextSlideOnInput = function(input, button, output) {
   if (input.val() == '') {
      alert('Please enter a guess.');
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

$(document).ready(function() { // user clicked submit button
   b1.on('click', function(event) {
      $.fn.nextSlideOnInput(a1, $(this), guess);
   });

   a1.keypress(function(e) { // user pressed enter
      if (e.which == 13) {
         $.fn.nextSlideOnInput($(this), b1, guess);
      }
   });

   reveal.on('click', function(event) { // reveal answer
      answer.removeClass("hide");
      reveal.addClass("clicked");
      var cont = answer.next();
      setTimeout(() => {
         cont.removeClass("hide");
      }, 3000);
   })

   $('.continue').on('click', function(event) { // user pressed continue button
      $.fn.nextSlideOnArrow($(this));
   })
});
