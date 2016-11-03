/**
 * @file Products.js
 *
 * This file is currently used only in products.html since only it deals
 * with products.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 Bilger Yahov, all rights reserved.
 */

var ProductsObj = {

	// Main buttons.
	secondHandMachinesButt: {},
	accumulatorsButt: {},
	diskoviBraniButt: {},
	kultivatoriButt:{},
	plugoveButt: {},
	hidravlichniMarkuchiButt: {},

	// Under section buttons.

	// Undersections
	diskoviBraniUnderSection: {},
	kultivatoriUnderSection: {},
	plugoveUnderSection: {},

	/**
	 * Gets the buttons from the DOM and attaches the corresponding event.
	 * Goes through a set of defensive checks for the DOM elements and the
	 * JavaScript objects that are used.
	 *
	 * Some of the buttons open under sections instead of requiring data from FireBase.
	 *
	 * @Example: button "Accumulators" calls FirebaseObj.getData('accumulators');
	 * @Example: button "Kultivatori" opens "KultivatoriUnderSection".
	 *
	 * @return void
	 */

	init: function(){

		var $self = this;

		// Get the main buttons.
		$self.secondHandMachinesButt = $('SecondHandMachines');
		$self.accumulatorsButt = $('Accumulators');
		$self.diskoviBraniButt = $('DiskoviBrani');
		$self.kultivatoriButt = $('Kultivatori');
		$self.plugoveButt = $('Plugove');
		$self.hidravlichniMarkuchiButt = $('HidravlichniMarkuchi');

		// Go through one single defensive check for all the buttons.
		if(!$self.secondHandMachinesButt || !$self.accumulatorsButt || !$self.diskoviBraniButt
		|| !$self.kultivatoriButt || !$self.plugoveButt || !$self.hidravlichniMarkuchiButt){

			console.error('ProductsObj.init(): One of the buttons for products does not exist!');
			return;
		}

		// Get the under sections.
		$self.diskoviBraniUnderSection = $('DiskoviBraniUnderSection');
		$self.kultivatoriUnderSection = $('KultivatoriUnderSection');
		$self.plugoveUnderSection  = $('PlugoveUnderSection');

		// Go through one single defensive check for the under sections.
		if(!$self.diskoviBraniUnderSection || !$self.kultivatoriUnderSection ||
		!$self.plugoveUnderSection){

			console.error('ProductsObj.init(): One of the undersections is not found!');
			return;
		}

		// Check if FirebaseObj is present, since we are going to use it.
		if(!FirebaseObj){

			console.error('ProductsObj.init(): FirebaseObj does not exist!');
			return;
		}

		// The ones that open under sections.
		$self.diskoviBraniButt.addEvent('click', function(){

			$self.openProductUnderSection($self.diskoviBraniUnderSection);
		});

		$self.kultivatoriButt.addEvent('click', function(){

			$self.openProductUnderSection($self.kultivatoriUnderSection);
		});

		$self.plugoveButt.addEvent('click', function(){

			$self.openProductUnderSection($self.plugoveUnderSection);
		});

		//The ones that make the requests to the FireBase Database.
		$self.secondHandMachinesButt.addEvent('click', function(){

			FirebaseObj.getData('second_hand_machines');
		});

		$self.accumulatorsButt.addEvent('click', function(){

			FirebaseObj.getData('accumulators');
		});
	},

	/**
	 * Opens an under section for products (more buttons).
	 *
	 * @param $element
	 *
	 * @return void
	 */

	openProductUnderSection: function($element){

		if($element.className.indexOf('w3-show') === -1){

			$element.className += ' w3-show';
		}
		else{

			$element.className = $element.className.replace(' w3-show', '');
		}
	}
};

document.addEvent('domready', function(){

	ProductsObj.init();
});