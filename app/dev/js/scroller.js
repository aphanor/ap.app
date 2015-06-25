$(document).ready(function(){
    $("div.main").onepage_scroll({
        sectionContainer: "section",
        easing: "ease-in-out",
        animationTime: 1000,
        pagination: true,
        updateURL: false,
        beforeMove: function(index) {},
        afterMove: function(index) {},
        loop: true,
        keyboard: true,
        responsiveFallback: false,
        direction: "vertical" 
    });
});