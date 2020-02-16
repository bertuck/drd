var fn_nav_primary = function () {

    $('.desktop .navbar-collapse .nav-item').hover(
        function() {
            var target = $('[data-toggle="dropdown"]', this);
            $(this).addClass("hover");
            $(target).dropdown('show').attr("aria-expanded", "true");
        }
        , function() {
            var target = $('[data-toggle="dropdown"]', this);
            $(this).removeClass("hover");
            $(target).dropdown('hide').attr("aria-expanded", "false");
        }
    );

}