//
// Scroll Top
//
var fn_scroll_top = function () {

    $('.scroll-to-top').on('click', function () {

        $('html, body').animate({ scrollTop: 0 }, 250);
        return false;
  
    });

};