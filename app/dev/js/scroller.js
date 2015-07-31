$(document).ready(function(){
    
    $('.down').click(function(){
        $("div.main").moveDown();
    });
    
    $('.up').click(function(){
        $("div.main").moveUp();
    });
    
    setTimeout(function(){ $('.scroll').fadeIn(1000) }, 1000);
    
    var scrolly;

    function scroller() {
        scrolly = setTimeout(function() { $("div.main").moveTo(2) }, 4400);
    }
	
	if(!$.cookie('cookie')) { 
        $.cookie('cookie', '1', { expires: 1, path: '/' });
        scroller();
    } else {
        $('.logo svg').hide(); 
    }
    
    function stopScroller() {
        clearTimeout(scrolly);
    }
    
    $('button.button--sacnite').click(function(){
        stopScroller()
    })
    
    $("div.main").onepage_scroll({
        sectionContainer: "section",
        easing: "ease-in-out",
        animationTime: 1000,
        pagination: true,
        updateURL: false,
        beforeMove: function(index) {},
        afterMove: function(index) {
            function loader() {
                if($('section.info').visible(true)) { 
                    $('.pie_progress').asPieProgress('start');
                    $(".pie_progressi").asPieProgress('start');
                    $(".pie_progresso").asPieProgress('start');
                    $(".pie_progressa").asPieProgress('start');
                    $(".pie_progressu").asPieProgress('start');
                }
            }
            loader()
            clearTimeout(scrolly)
            
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $('section.project-planner').hide();
                $('.img_container').hide();
            }
            else {
                if($('section.project-planner').visible(true)) {
                    $('div#projectplannerformarea').slideDown(500, 'swing');
                }
            }
            
            $('button.button--sacnite').addClass('bounce');
            
            $('body').on({
                mouseenter: function() {
                    $(this).find('button.button--sacnite').removeClass('bounce');
                    clearTimeout(scrolly);
                },
                mouseleave: function() {
                    $(this).find('button.button--sacnite').addClass('bounce');
                }
            }, 'button.button--sacnite');
            
            /*var intervalContact;
    
            function intervalContact() {
                intervalContact = setInterval(function(){ $(".contact").effect("bounce", { times: 3 }, 800);}, 4000);
            }
            
            function StopInterval() {
                clearInterval(intervalContact);
            }
            
            $('.contact').click(function(){
                clearTimeout(scrolly)
                StopInterval()
            })
            
            $('.contact').hover(function(){
                StopInterval()
            })
            intervalContact() */
        },
        loop: false,
        keyboard: true,
        responsiveFallback: false,
        direction: "vertical" 
    });
    
    /*! SVG Pie Timer 0.9.1 | Anders Grimsrud, grint.no | MIT License | github.com/agrimsrud/svgPieTimer.js */
    
    ;(function(w) {
    
        'use strict';
    
        // Date.now fix by Ari Fuchs, afuchs.tumblr.com/post/23550124774/date-now-in-ie8
    
        Date.now = Date.now || function() { return +new Date };
    
        // Draw SVG path
      
        function draw(element, rate) {
            var count = element.length,
                angle = 360 * rate;
    
            angle %= 360;
    
            var rad = (angle * Math.PI / 180), 
                x = Math.sin(rad) * 125, 
                y = Math.cos(rad) * - 125, 
                mid = (angle > 180) ? 1 : 0, 
                shape = 'M 0 0 v -125 A 125 125 1 ' 
                       + mid + ' 1 ' 
                       +  x  + ' ' 
                       +  y  + ' z';
    
            // If array of elements, draw each one
          
            if(element instanceof Array)
                while(count--)
                    element[count].setAttribute('d', shape)
            else
                element.setAttribute('d', shape)
        }
    
        // Prepare timer
        // Define in global scope
      
        w.svgPieTimer = function(props) {
    
            var element = props.element,
                duration = props.duration || 1000,
                n = props.loops;
    
            // Optional warning
            
            if(!element) throw "SVG Pie Timer: Error - element required"
    
            // This part might be confusing:
            // If n==0, do infinite loops
            // In other cases where n is set, do n loops
            // If n is not set, do 1 loop
            // Do it this way to prevent mixing n==0 and !n
            
            n = (n==0) ? 0 : n ? n : 1;
    
            var end = Date.now() + duration * n,
                totaldur = duration * n;
    
            // Animate frame by frame
          
            (function frame() {
                var current = Date.now(),
                    remaining = end - current,
    
                    // Now set rotation rate
                    // E.g. 50% of first loop returns 1.5
                    // E.g. 75% of sixth loop returns 6.75
                    // Has to return >0 for SVG to be drawn correctly
                    // If you need the current loop, use Math.floor(rate)
    
                    rate = n + 1 - remaining / duration;
    
                // As requestAnimationFrame will draw whenever capable, 
                // the animation might end before it reaches 100%.
                // Let's simulate completeness on the last visual
                // frame of the loop, regardless of actual progress
              
                if(remaining < 60) {
                    
                    // 1.0 might break, set to slightly lower than 1
                    // Update: Set to slightly lower than n instead
                  
                    draw(element, n - 0.0001);
                  
                  
                    // Stop animating when we reach n loops (if n is set)
                 
                    if(remaining < totaldur && n) return
                }
       
                // To reverse, uncomment this line
                //rate = 360 - rate;
              
                // Draw
                draw(element, rate);
              
                // Request next frame
              
               requestAnimationFrame(frame);
            }());
        }
    
    })(window, undefined);
    
    var loader = document.getElementById('loader'),
        border = document.getElementById('border');
    
    svgPieTimer({
        // Element (Required) SVG sub element to animate. Accepts array.
        element: [loader, border],
        
        // Duration (Optional) In milliseconds. Defaults to 1000.
        duration: 4000,
        
        // Loops (Optional) Defaults to 1. Set to 0 for infinite.
        loops: 1
    });
    
    //setTimeout(function() { $("div.main").moveTo(2) }, 4400) 
    
});