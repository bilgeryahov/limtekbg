/**
 * @file TemplateProcessor.js
 *
 * This file is currently used only in products.html since only it deals
 * with products and templates.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 Bilger Yahov, all rights reserved.
 */
var TemplateProcessorObj = {

	productPlaceholder: {},
	productTemplate: {},

	/**
	 * Initializes the main functionality.
	 *
	 * @return void
	 */

	init: function(){


	},

	/**
	 * Goes through a defensive check to make sure that everything needed is present.
	 * Puts the template data inside the placeholder.
	 *
	 * @param $templateData
	 *
	 * @return void
	 */

	generateTemplate: function($templateData){

		var $self = this;

		$self.productPlaceholder = $('ProductPlaceHolder');
		$self.productTemplate = $('ProductTemplate');

		if(!$self.productPlaceholder || !$self.productTemplate){

			console.error('TemplateProcessorObj.generateTemplate(): ProductPlaceHolder and/or ProductTemplate not found!');
			return;
		}

		var $compiled = Handlebars.compile($self.productTemplate.get('html'));

		$self.productPlaceholder.set('html', $compiled({products: $templateData}));
	}
};

document.addEvent('domready', function(){

	TemplateProcessorObj.init();
});