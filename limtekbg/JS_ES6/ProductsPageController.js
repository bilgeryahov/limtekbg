/**
 * @file ProductsPageController.js
 *
 * Module which exposes controller functionality to the Products page.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

const ProductsPageController = (function () {

    /*
     * Encapsulate the logic.
     */

    const Logic = {

        /**
         * Initializes the main functionality.
         *
         * Goes through defensive checks, to avoid eventual problems on the page.
         *
         * @return void
         */

        init(){

            if(!ProductsLoader){

                console.error('ProductsPageController.init(): ProductsLoader is missing.');
                return;
            }
        },

        actionCategoryButton($button){

            let $category = $button.id.replace('button_','');
            ProductsLoader.constructCategoryPath($category);
        },

        showMainCategories(){

            ProductsLoader.loadMainCategories();
        },

        showProductImages($product){

            ProductsLoader.loadImagesForProduct($product);
        },

        enableProductImagesModal($enable){

            let $productImagesModal = $('ProductImagesPlaceholder');

            if(!$productImagesModal){

                console.error('ProductsPageController.enableProductImagesModal(): the ProductImagesPlaceholder is' +
                    'missing!');
                return;
            }

            if($enable){

                $productImagesModal.style.display = 'block';
                return;
            }

            $productImagesModal.style.display = 'none';
        }
    };

    return{

        init(){

            Logic.init();
        },

        actionCategoryButton($button){

            Logic.actionCategoryButton($button);
        },

        showMainCategories(){

            Logic.showMainCategories();
        },

        showProductImages($product){

            Logic.showProductImages($product)
        },

        enableProductImagesModal($enable){

            Logic.enableProductImagesModal($enable);
        }
    }
})();

document.addEvent('domready', function(){

    ProductsPageController.init();
});