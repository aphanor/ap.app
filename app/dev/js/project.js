//==================================
//! Copyright - Alexis PHANOR
//! 2015
//==================================

// Project Planner - Form Animations

$(document).ready(function(){


// Initialiase variables

var main_button = $('a.project-planner-button');
var normal_button = $('form-choice-button');
var clicked_button = $('form-choice-button-active');
var arrow = $('div.projectplanner-triangle');

var buttons = $('a.form-choice-button');
var container = $('div#projectplannerformarea');
var header_container = $('.projectplanner');

var slider_one = $( "#slider-one" );
var slider_two = $( "#slider-two" );
var pounds_sign = "£ ";
var weeks_indicator = " Weeks";
var amount_holder = "#amount";
var amount_holder2 = "#amount2";

// Main functions 

container.hide();
arrow.css('margin-bottom', '-1.25em');

 
	// SlideDown 
	
	main_button.click(function(){
	    container.slideToggle(400, 'swing');
	});
	
	
	// Toggle Classes for the buttons
	
	buttons.click(function(){
	    
	    if ($(this).is('.form-choice-button')) {
		    $(this).removeClass('form-choice-button').addClass('form-choice-button-active');
		    var choice = $(this).attr('name');
		    
		    $('form.formo').append('<input type="hidden" class="bnum" name="'+choice+'" value="'+choice+'">');
		}
		else {
		    $(this).removeClass('form-choice-button-active').addClass('form-choice-button');
		    $('form.formo').find('input[value="Illustration"]').remove();
		    $('form.formo').find('input[value="Branding"]').remove();
		    $('form.formo').find('input[value="PrintDesign"]').remove();
		    $('form.formo').find('input[value="WebsiteDesign"]').remove();
		    $('form.formo').find('input[value="WebsiteDesign&Build"]').remove();
		    $('form.formo').find('input[value="UI/MobileDesign"]').remove();
		}
	});
	
	// Project Budget Slider Function
	
	$(function() {
	    $( "#slider-one" ).slider({
	      range: true,
	      min: 500,
	      max: 15000,
	      values: [ 3400, 9000 ],
	      step: 100,
	      slide: function( event, ui ) {
	        $( "#amount" ).val( "£" + ui.values[ 0 ] + " - £" + ui.values[ 1 ]);
	      }
	    });
	    $( "#amount" ).val( "£" + $( "#slider-one" ).slider( "values", 0 ) +
	      " - £" + $( "#slider-one" ).slider( "values", 1 ));
	    $('#amount').attr('name', 'slider-one');
	  });
	  
	// Deadline Function
	
	$(function() {
	    $( "#slider-two" ).slider({
	      range: true,
	      min: 1,
	      max: 15,
	      values: [ 2, 6 ],
	      slide: function( event, ui ) {
	        $( "#amount2" ).val(ui.values[ 0 ] + " Weeks" + " - " + ui.values[ 1 ] + " Weeks");
	      }
	    });
	    $( "#amount2" ).val($( "#slider-two" ).slider( "values", 0 ) + " Weeks" +
	      " - " + $( "#slider-two" ).slider( "values", 1 ) + " Weeks" );
	    $('#amount2').attr('name', 'slider-two');
	  });
	  
	  $('input[type=text]').css('font-weight', '600');
	  $('input[type=text]').css('font-family:', '"Open Sans"'); 
  
});