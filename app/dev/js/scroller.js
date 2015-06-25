$(document).ready(function(){
    
    $('.down').click(function(){
        $("div.main").moveDown();
    });
    
    $('.up').click(function(){
        $("div.main").moveUp();
    });
    
    setTimeout(function(){ $('.scroll').fadeIn(1000) }, 1000);
    
    var done = false;
    
    $("div.main").onepage_scroll({
        sectionContainer: "section",
        easing: "ease-in-out",
        animationTime: 1000,
        pagination: true,
        updateURL: false,
        beforeMove: function(index) {},
        afterMove: function(index) {
            function loader() {
                if(!$('link[href="prod/css/loader.css"]').length) { 
                    $('head').append('<link rel="stylesheet" type="text/css" href="prod/css/loader.css"/>');
                }
            }
            loader()
        },
        loop: true,
        keyboard: true,
        responsiveFallback: false,
        direction: "vertical" 
    });
    
});