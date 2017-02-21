/**
 * @file TemplateProcessor.js
 *
 * Module, which currently processes the templates.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

const TemplateProcessor = (function(){

	/*
	 * Encapsulate the logic.
	 */

   const Logic = {

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

           if(!ProductsPageController){

               console.error('TemplateProcessor.init(): ProductsPageController not found!');
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
       },

       /**
        * Makes sure that the modal with product images is shown
        * instantly when the "Виж изображения" button is clicked.
        *
        * @return void
        */

       generateProductImagesLoadingState(){

           const $self = this;

           // Make the regular defensive checks.
           const $productImagesPlaceholder = $('ProductImagesPlaceholder');
           const $productImagesTemplate    = $('ProductImagesTemplate');

           if(!$productImagesPlaceholder || !$productImagesTemplate){

               console.error('TemplateProcessor.generateProductImagesLoadingState(): ProductImagesPlaceholder or' +
                   'ProductImagesTemplate is missing.');
               return;
           }

           let $compiled = Handlebars.compile($productImagesTemplate.get('html'));

           // Show the modal.
           ProductsPageController.enableProductImagesModal(true);

           // First show loading message for one second.
           $productImagesPlaceholder.set('html', $compiled({loading: true}));
       },

       /**
        * Generates the modal with images (if any) for a
        * particular product.
        *
        * @param $data
        *
        * @return void
        */

       generateProductImages($data){

           const $self = this;

           // Make the regular defensive checks.
           const $productImagesPlaceholder = $('ProductImagesPlaceholder');
           const $productImagesTemplate    = $('ProductImagesTemplate');

           if(!$productImagesPlaceholder || !$productImagesTemplate){

               console.error('TemplateProcessor.generateProductImages(): ProductImagesPlaceholder or' +
                   'ProductImagesTemplate is missing.');
               return;
           }

           let $compiled = Handlebars.compile($productImagesTemplate.get('html'));

           // Check if there is data.
           if($data === null || $data === undefined || Object.keys($data).length ===0 || $data.length === 0){

               // No data.
               $productImagesPlaceholder.set('html', $compiled({no_images: true}));
               return;
           }

		   /*
			* There is data. The data is an array (hopefully) with
			* image URLs. The idea here is to make a slide show.
			* So what needs to be done is the following:
			* If there are more than 1 image, make sure that
			* only the first one (0th in the array) will be visible
			* at first.
			*/

           // Let's first create the object to hold.
           let $holdURLs = {};

           $data.forEach(function($element, $index){

               if($index === 0){

                   $holdURLs[$index] = {
                       display: 'block',
                       URL: $element
                   };
               }
               else{

                   $holdURLs[$index] = {
                       display: 'none',
                       URL: $element
                   };
               }
           });

           // Pass the newly created object
           $productImagesPlaceholder.set('html', $compiled({images: $holdURLs}));
       }
   };

   return{

	   init(){
		   Logic.init();
	   },

       generateProductsForCategory($data){

		   Logic.generateProductsForCategory($data);
	   },

       generateProductsTree($data, $wait){

		   Logic.generateProductsTree($data, $wait);
	   },

       generateProductImagesLoadingState(){

		   Logic.generateProductImagesLoadingState();
	   },

       generateProductImages($data){

		   Logic.generateProductImages($data);
	   }
   }
})();

document.addEvent('domready', function(){

	TemplateProcessor.init();
});