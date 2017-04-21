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

           const $productsPlaceholder = $('ProductsPlaceholder');
           const $productsTemplate = $('ProductsTemplate');

           if(!$productsPlaceholder || !$productsTemplate){

               console.error('TemplateProcessor.generateProductsForCategory(): ProductsPlaceholder and/or ' +
                   'ProductsTemplate not found!');
               return;
           }

           // Make sure that the real products template is visible.
           $productsPlaceholder.className = $productsPlaceholder.className.replace(' w3-hide', '');

           let $compiled = Handlebars.compile($productsTemplate.get('html'));

           // Check if there is data to show.
           if($data === null){

               $productsPlaceholder.set('html', $compiled({no_products: true}));
           }
           else{

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

               $productsPlaceholder.set('html', $compiled({products: $data}));
           }

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
        * Makes sure that the user is informed whenever the
        * products tree is being loaded and waiting is required.
        *
        * @return void
        */

       generateProductsTreeLoadingState(){

           const $productCategoriesPlaceholder = $('ProductCategoriesPlaceholder');
           const $productCategoriesTemplate = $('ProductCategoriesTemplate');

           if(!$productCategoriesPlaceholder || !$productCategoriesTemplate){

               console.error('TemplateProcessor.generateProductsTreeLoadingState(): ProductCategoriesPlaceholder' +
                   ' and/or ProductCategoriesTemplate not found!');
               return;
           }

           let $compiled = Handlebars.compile($productCategoriesTemplate.get('html'));

           $productCategoriesPlaceholder.set('html', $compiled({loading: true}));
       },

       /**
        * Generates the products tree template. (Or sub-categories)
        * If generating a sub tree, "Go back" button should be shown.
        *
        * When generating products tree make sure that
        * the actual products are hidden, so the user can concentrate
        * on the tree - categories.
        *
        * @param $data
        * @param $isSubTree
        *
        * @return void
        */

       generateProductsTree($data, $isSubTree){

           const $productCategoriesPlaceholder = $('ProductCategoriesPlaceholder');
           const $productCategoriesTemplate = $('ProductCategoriesTemplate');

           if(!$productCategoriesPlaceholder || !$productCategoriesTemplate){

               console.error('TemplateProcessor.generateProductsTree(): ProductCategoriesPlaceholder' +
                   ' and/or ProductCategoriesTemplate not found!');
               return;
           }

           const $productsPlaceholder = $('ProductsPlaceholder');

           if(!$productsPlaceholder){

               console.error('TemplateProcessor.generateProductsTree(): ProductsPlaceholder not found!');
               return;
           }

           // Make sure that the actual products are hidden.
           if($productsPlaceholder.className.indexOf('w3-hide') === -1){

               $productsPlaceholder.className += ' w3-hide';
           }

           let $compiled = Handlebars.compile($productCategoriesTemplate.get('html'));

           if(!$data){

               console.error('TemplateProcessor.generateProductsTree(): No data for generating' +
                   ' a products tree!');
               return;
           }

           if($isSubTree){

               $productCategoriesPlaceholder.set('html', $compiled({categories: $data, go_back: true}));
               return;
           }

           $productCategoriesPlaceholder.set('html', $compiled({categories: $data, go_back: false}));
       },

       /**
        * Makes sure that the modal with product images is shown
        * instantly when the "Виж изображения" button is clicked.
        *
        * @return void
        */

       generateProductImagesLoadingState(){

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
       },

       /**
        * Generates a custom message alert.
        *
        * @param $message
        *
        * @return void
        */

       generateCustomMessage($message){

            const $customMessageTemplate = $('CustomMessageTemplate');
            const $customMessagePlaceholder = $('CustomMessagePlaceholder');

            if(!$customMessagePlaceholder || !$customMessageTemplate){

                console.error('TemplateProcessor.generateCustromMessage(): CustomMessagePlaceholder' +
                    ' or CustomMessageTemplate is missing!');

                return;
            }

            // Show the modal.
           CommonReusableUserInterfaceManager.enableCustomMessageModal(true);

            let $compiled = Handlebars.compile($customMessageTemplate.get('html'));
            $customMessagePlaceholder.set('html', $compiled({message: $message}));
       }
   };

   return{

	   init(){
		   Logic.init();
	   },

       generateProductsForCategory($data){

		   Logic.generateProductsForCategory($data);
	   },

       generateProductsTreeLoadingState(){

           Logic.generateProductsTreeLoadingState();
       },

       generateProductsTree($data, $isSubTree){

		   Logic.generateProductsTree($data, $isSubTree);
	   },

       generateProductImagesLoadingState(){

		   Logic.generateProductImagesLoadingState();
	   },

       generateProductImages($data){

		   Logic.generateProductImages($data);
	   },

       generateCustomMessage($message){

           Logic.generateCustomMessage($message);
       }
   }
})();

document.addEvent('domready', function(){

	TemplateProcessor.init();
});