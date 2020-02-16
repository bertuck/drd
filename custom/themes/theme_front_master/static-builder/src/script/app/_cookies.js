//
// COOKIES
//
var fn_cookies = function () {

    $(".eu-cookie-compliance-buttons button").click(function(){
	    $("body").addClass("cookies-hidden");
	});

	$(".eu-cookie-compliance-category-description").wrapInner( "<p></p>");

};