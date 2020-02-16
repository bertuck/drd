var fn_a11y_fixes = function () {

    // add (nouvelle fenêtre) in title
    var targetBlank = $('.wysiwyg a[target="_blank"]');

    targetBlank.each(function() {
        if ($(this).attr("title")) {
            $(this).attr("title", function(){ return $(this).attr("title") + " (nouvelle fenêtre)" });
        } else {
            $(this).attr("title", function(){ return $(this).text() + " (nouvelle fenêtre)" });
        }
    });

}
