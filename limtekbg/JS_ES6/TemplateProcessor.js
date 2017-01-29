/**
 * @file TemplateProcessor.js
 *
 * Module, which currently processes the templates.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 Bilger Yahov, all rights reserved.
 */

const TemplateProcessor = {

	productPlaceholder: {},
	productTemplate: {},

	// Display when there is no data available.
	noDataNotifier: {},

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
	 * If the template data is 'null' a notification is shown.
	 *
	 * @param $templateData
	 *
	 * @return void
	 */

	generateTemplate: function($templateData){

		const $self = this;

		$self.productPlaceholder = $('ProductPlaceHolder');
		$self.productTemplate = $('ProductTemplate');

		if(!$self.productPlaceholder || !$self.productTemplate){

			console.error('TemplateProcessor.generateTemplate(): ProductPlaceHolder and/or ProductTemplate not found!');
			return;
		}

		$self.noDataNotifier = $('NoData');
		if(!$self.noDataNotifier){

			console.error('TemplateProcessor.generateTemplate(): no data notifier is missing!');
			return;
		}

		// Make sure that at first the no data message is hidden!
		if($self.noDataNotifier.className.indexOf('w3-hide') === -1){

			// Hide it, ONLY IF it is not already hidden.
			$self.noDataNotifier.className += ' w3-hide';
		}

		// Check if there is data to show.
		if($templateData === null){

			// Well... if there is no data, show me the message.
			$self.noDataNotifier.className = $self.noDataNotifier.className.replace(' w3-hide', '');
		}

		// Deal with the template (empty or full, you decide!).
		let $compiled = Handlebars.compile($self.productTemplate.get('html'));

		// Make sure that there is data for this category products.
		if($templateData !== null) {

			/*
			 * The description attribute of each data element is separated by ';'
			 * So this makes sure that each part of the description stands for itself.
			 * By doing so, the list effect is accomplished in the front-end. So each
			 * sentence in the description is a list element.
			 */

			$templateData.forEach(function($element){

				if($element.hasOwnProperty('description')){

					let $description = $element['description'];
					$element['description'] = $description.split(';');
				}
			});
		}

		$self.productPlaceholder.set('html', $compiled({products: $templateData}));
	}
};

document.addEvent('domready', function(){

	TemplateProcessor.init();
});