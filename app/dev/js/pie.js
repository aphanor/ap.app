jQuery(document).ready(function($){
    $('.pie_prog').asPieProgress({
        namespace: 'pie_progress',
        goal: 92,
        min: 0,
        speed: 50,
        easing: 'ease',
        barcolor: '#0cfffa',
        trackcolor: '#1b363c',
        barsize: 3
    });
    
    $('.pie_progresso').asPieProgress({
        namespace: 'pie_progress',
        speed: 55,
        easing: 'ease',
        barcolor: '#60ffa0',
        trackcolor: '#243632',
        goal: 88,
        barsize: '3'
    });
    
    $('.pie_progressa').asPieProgress({
        namespace: 'pie_progress',
        speed: 60,
        easing: 'ease',
        barcolor: '#58e6ff',
        trackcolor: '#23333d',
        goal: 85,
        barsize: '3'
    });
    
    $('.pie_progressi').asPieProgress({
        namespace: 'pie_progress',
        speed: 80,
        easing: 'ease',
        barcolor: '#0085b6',
        trackcolor: '#23333d',
        goal: 70,
        barsize: '3'
    });
    
    $('.pie_progressu').asPieProgress({
        namespace: 'pie_progress',
        speed: 90,
        easing: 'ease',
        barcolor: '#05ff76',
        trackcolor: '#1a362e',
        goal: 62,
        barsize: '3'
    });
    
    $('.pie_progresse').asPieProgress({
        namespace: 'pie_progress',
        speed: 100,
        easing: 'ease',
        barcolor: '#0cfffa',
        trackcolor: '#1b363c',
        goal: 50,
        barsize: '3'
    });

});