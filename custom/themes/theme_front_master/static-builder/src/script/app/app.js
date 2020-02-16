// * * * * * * * * * * * * * * * * * * * *
//
// On donne le focus à la fenetre du site et non au navigateur
//
// * * * * * * * * * * * * * * * * * * * *
$(window).focus();

// * * * * * * * * * * * * * * * * * * * *
//
// DOM READY : init function
//
// * * * * * * * * * * * * * * * * * * * *
$(document).ready(function() {
    fn_cookies();
    fn_cover();
    fn_table();
    fn_a11y_fixes();
    fn_iframe();
    fn_nav_primary();
    fn_adjustAnchorOnClick();
    fn_hidePassword();

    $('.custom-control label').addClass('custom-control-label');
});

$(window).on('load', function() {
    fn_adjustAnchor();
});

fn_glider();