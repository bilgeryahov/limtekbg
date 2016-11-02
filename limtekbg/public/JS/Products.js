/**
 * @file Products.js
 *
 * This file is currently used only in products.html since only it deals
 * with products and templates.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 Bilger Yahov, all rights reserved.
 */

var ProductsObj = {

	// Buttons on Products page.
	secondHandMachinesButt: {},
	accumulatorsButt: {},

	/**
	 * Gets the buttons from the DOM and attaches the corresponding event.
	 * Goes through a set of defensive checks for the DOM elements and the
	 * JavaScript objects that are used.
	 *
	 * @Example: button "Accumulators" calls FirebaseObj.getData('accumulators');
	 *
	 * @return void
	 */

	init: function(){

		var $self = this;

		$self.secondHandMachinesButt = $('SecondHandMachines');
		$self.accumulatorsButt = $('Accumulators');

		if(!$self.secondHandMachinesButt || !$self.accumulatorsButt){

			console.error('ProductsObj.init(): One of the buttons for products does not exist!');
			return;
		}

		if(!FirebaseObj){

			console.error('ProductsObj.init(): FirebaseObj does not exist!');
			return;
		}

		$self.secondHandMachinesButt.addEvent('click', function(){

			FirebaseObj.getData('second_hand_machines');
		});


		$self.accumulatorsButt.addEvent('click', function(){

			FirebaseObj.getData('accumulators');
		});
	}
};

document.addEvent('domready', function(){

	ProductsObj.init();
});