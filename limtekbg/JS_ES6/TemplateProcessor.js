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

    /**
     * Initializes the main functionality.
     * Makes the defensive checks for the external modules used.
     *
     * @return void
     */

	init(){

		const $self = this;

		if(!Handlebars){

			console.error('TemplateProcessor.init(): Handlebars not found!');
			return;
		}
	},

    /**
	 * Generates REAL PRODUCTS templates.
	 *
     * @param $data
	 *
	 * @return void
     */

	generateProductsForCategory($data){

		const $self = this;

		const $productsPlaceholder = $('ProductsPlaceholder');
		const $productsTemplate = $('ProductsTemplate');

		if(!$productsPlaceholder || !$productsTemplate){

			console.error('TemplateProcessor.generateProductsForCategory(): ProductsPlaceholder and/or ' +
				'ProductsTemplate not found!');
			return;
		}

		const $noDataNotifier = $('NoData');
		if(!$noDataNotifier){

			console.error('TemplateProcessor.generateProductsForCategory(): no data notifier is missing!');
			return;
		}

		// Make sure that at first the no data message is hidden!
		if($noDataNotifier.className.indexOf('w3-hide') === -1){

			// Hide it, ONLY IF it is not already hidden.
			$noDataNotifier.className += ' w3-hide';
		}

		// Check if there is data to show.
		if($data === null){

			// Well... if there is no data, show me the message.
			$noDataNotifier.className = $noDataNotifier.className.replace(' w3-hide', '');
		}

		// Deal with the template (empty or full, you decide!).
		let $compiled = Handlebars.compile($productsTemplate.get('html'));

		// Make sure that there is data for this category products.
		if($data !== null){

			/*
			 * The description attribute of each data element is separated by ';'
			 * So this makes sure that each part of the description stands for itself.
			 * By doing so, the list effect is accomplished in the front-end. So each
			 * sentence in the description is a list element.
			 */

			$data.forEach(function($element){

				if($element.hasOwnProperty('description')){

					let $description = $element['description'];
					$element['description'] = $description.split(';');
				}
			});
		}

		$productsPlaceholder.set('html', $compiled({products: $data}));

        // Try to scroll.
        new Fx.Scroll(window, {
            offset: {
                x: 0,
                y: -90 // The offset from the top side.
            },
            duration: 1000,
            wheelStops: false
        }).toElement($productsPlaceholder);
	},

    /**
	 * Generates the products tree template. (Or sub-categories)
	 *
     * @param $data
	 * @param $wait
	 *
	 * @return void
     */

	generateProductsTree($data, $wait){

        const $self = this;

        const $productCategoriesPlaceholder = $('ProductCategoriesPlaceholder');
        const $productCategoriesTemplate = $('ProductCategoriesTemplate');

        if(!$productCategoriesPlaceholder || !$productCategoriesTemplate){

            console.error('TemplateProcessor.generateProductsTree(): ProductCategoriesPlaceholder' +
				' and/or ProductCategoriesTemplate not found!');
            return;
        }

        const $noDataNotifier = $('NoData');
        if(!$noDataNotifier){

            console.error('TemplateProcessor.generateProductsTree(): no data notifier is missing!');
            return;
        }

        /*
         * Usually the no data notifier should not be needed here.
         */

        // Make sure that at first the no data message is hidden!
        if($noDataNotifier.className.indexOf('w3-hide') === -1){

            // Hide it, ONLY IF it is not already hidden.
            $noDataNotifier.className += ' w3-hide';
        }

        // Check if there is data to show.
        if($data === null){

            // Well... if there is no data, show me the message.
            $noDataNotifier.className = $noDataNotifier.className.replace(' w3-hide', '');
        }

        // Deal with the template (empty or full, you decide!).
        let $compiled = Handlebars.compile($productCategoriesTemplate.get('html'));

        /*
         * We want to wait when loading the first products tree, so the user thinks
         * we do very hard job. Thanks.
         */

        if($wait){

            setTimeout(function(){

                $productCategoriesPlaceholder.set('html', $compiled({categories: $data}));
            }, 2000);

            return;
		}

		// Here we load a sub-category.
        $productCategoriesPlaceholder.set('html', $compiled({categories: $data}));
	}
};

document.addEvent('domready', function(){

	TemplateProcessor.init();
});