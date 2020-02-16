//
// GLIDER CARROUSEL INIT
// https://nickpiscitelli.github.io/Glider.js/
//
var fn_glider = function () {

    window.addEventListener('load', function(){
        if ($('.o-block-actualites-carrousel-items').length) {
            new Glider(document.querySelector('.o-block-actualites-carrousel-items'), {
                // Mobile-first defaults
                slidesToShow: 1,
                slidesToScroll: 'auto',
                scrollLock: true,
                rewind: true,
                dots: '.o-block-actualites-carrousel .glider-pagination',
                arrows: {
                    prev: '.o-block-actualites-carrousel .glider-prev',
                    next: '.o-block-actualites-carrousel .glider-next'
                },
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3
                        }
                    }
                ]
            })
        }
    });

    if ($('.o-block-actualites-carrousel-items').length) {
        var total_element = 3;

        $(document).ready( function () {
            var slides = document.querySelectorAll('.o-block-actualites-carrousel-item').length;
            if (slides <= total_element) {
                var pagination = document.querySelectorAll('.o-block-actualites-carrousel .glider-pagination-wrapper');
                for (var i = 0; i < pagination.length; ++i) {
                    pagination[i].classList.remove('visible');
                    pagination[i].parentNode.classList.add("glider-pagination-hidden");
                }
            }
        });
    }

    if ($('.o-block-focus-carrousel-items').length) {
        window.addEventListener('load', function(){
            new Glider(document.querySelector('.o-block-focus-carrousel-items'), {
                // Mobile-first defaults
                slidesToShow: 1,
                slidesToScroll: 1,
                scrollLock: true,
                rewind: true,
                dots: '.o-block-focus-carrousel .glider-pagination',
                arrows: {
                    prev: '.o-block-focus-carrousel .glider-prev',
                    next: '.o-block-focus-carrousel .glider-next'
                }
            })
        });
    }

};