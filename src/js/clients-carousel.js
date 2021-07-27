$(document).ready(function(){
    
    const owl = $('#clients-slider');
    owl.owlCarousel({
        nav: false,
        dotsEach: 4,
        margin: 30
    });

    const prev = $('#sliderPrev');
    const next = $('#sliderNext');

    prev.click(function () {
        owl.trigger('prev.owl.carousel');
    })
    next.click(function () {
        owl.trigger('next.owl.carousel');
    })
});
