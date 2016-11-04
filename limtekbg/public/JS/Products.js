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
	mashiniVtoraUpotrebaButt: {},
	akumulatoriButt: {},
	diskoviBraniButt: {},
	kultivatoriButt:{},
	plugoveButt: {},
	hidravlichniMarkuchiButt: {},

	// Under section buttons.
	lagernoTqloButt: {},
	diskoveButt: {},
	s_prujinniOrganiButt: {},
	lapiButt: {},
	shilaButt: {},
	lemejiButt: {},
	zubiShilaButt: {},

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
		$self.mashiniVtoraUpotrebaButt = $('MashiniVtoraUpotreba');
		$self.akumulatoriButt = $('Akumulatori');
		$self.diskoviBraniButt = $('DiskoviBrani');
		$self.kultivatoriButt = $('Kultivatori');
		$self.plugoveButt = $('Plugove');
		$self.hidravlichniMarkuchiButt = $('HidravlichniMarkuchi');

		// Go through one single defensive check for all the buttons.
		if(!$self.mashiniVtoraUpotrebaButt || !$self.akumulatoriButt || !$self.diskoviBraniButt
		|| !$self.kultivatoriButt || !$self.plugoveButt || !$self.hidravlichniMarkuchiButt){

			console.error('ProductsObj.init(): One of the buttons for products does not exist!');
			return;
		}

		// Get the under section buttons.
		$self.lagernoTqloButt = $('LagernoTqlo');
		$self.diskoveButt = $('Diskove');
		$self.s_prujinniOrganiButt = $('S_prujinniOrgani');
		$self.lapiButt = $('Lapi');
		$self.shilaButt = $('Shila');
		$self.lemejiButt = $('Lemeji');
		$self.zubiShilaButt = $('ZubiShila');

		// Go through one single defensive check for all the buttons.
		if(!$self.lagernoTqloButt || !$self.diskoveButt || !$self.s_prujinniOrganiButt
		|| !$self.lapiButt || !$self.shilaButt || !$self.lemejiButt || !$self.zubiShilaButt){

			console.error('ProductsObj.init(): One of the undersection buttons for products does not exist!');
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
		$self.mashiniVtoraUpotrebaButt.addEvent('click', function(){

			FirebaseObj.getData('mashini_vtora_upotreba');
		});

		$self.akumulatoriButt.addEvent('click', function(){

			FirebaseObj.getData('akumulatori');
		});

		$self.hidravlichniMarkuchiButt.addEvent('click', function(){

			FirebaseObj.getData('hidravlichni_markuchi_i_nakrainici');
		});

		$self.lagernoTqloButt.addEvent('click', function(){

			FirebaseObj.getData('diskovi_brani/lagerno_tqlo');
		});

		$self.diskoveButt.addEvent('click', function(){

			FirebaseObj.getData('diskovi_brani/diskove');
		});

		$self.s_prujinniOrganiButt.addEvent('click', function(){

			FirebaseObj.getData('kultivatori/s_prujinni_organi');
		});

		$self.lapiButt.addEvent('click', function(){

			FirebaseObj.getData('kultivatori/lapi');
		});

		$self.shilaButt.addEvent('click', function(){

			FirebaseObj.getData('kultivatori/shila');
		});

		$self.lemejiButt.addEvent('click', function(){

			FirebaseObj.getData('plugove/lemeji');
		});

		$self.zubiShilaButt.addEvent('click', function(){

			FirebaseObj.getData('plugove/zubi_shila');
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