/**
 * @file administration_panel_products_categories.js
 *
 * AdministrationPanelProductsCategories module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AdministrationPanelProductsCategories = (function(){

    const Logic = {

        _templatePath: './Modules/AdministrationPanelProductsCategories/administration_panel_products_categories.html',
        _placeholderName: 'AdministrationPanelProductsCategoriesPlaceholder',
        _template: null,

        _productCategoriesSelectBox : null,

        _categoryDetailsNameInput: null,
        _categoryDetailsNameSaveButton: null,

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const $self = this;

            if(!FirebaseDatabaseAndStorageManager){

                console.error('AdministrationPanelProductsCategories.init(): ' +
                    'FirebaseDatabaseAndStorageManager is not present!');
                return;
            }

            if(!CustomMessage){

                console.error('AdministrationPanelProductsCategories.init(): ' +
                    ' CustomMessage is not present!');
                return;
            }

            $self.renderTemplate();
        },

        /**
         * Renders the template.
         *
         * @return void
         */

        renderTemplate(){

            const $self = this;

            $self._template = new Template(
                $self._templatePath, $self._placeholderName, {}
            );

            $self._template.displayMain();
        },

        /**
         * Show the module.
         *
         * @return void
         */

        showMe(){

            const $self = this;
            $self._template.makeVisible();
        },

        /**
         * Hide the module.
         *
         * @return void
         */

        hideMe(){

            const $self = this;
            $self._template.makeInvisible();
        },

        /**
         * Fetches all the product categories from the Firebase realtime database.
         *
         * @return void
         */

        fetchProductCategories(){

            const $self = this;

            // Set triggered state for the button.
            DevelopmentHelpers.setButtonTriggeredState('FetchProductCategoriesButton', true);

            let $pathNodes = ['products', 'categories_details'];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $extra = {};

            FirebaseDatabaseAndStorageManager.firebaseGET(
                $path,
                $extra,
                function ($error, $data) {

                    if($error){

                        // Clear triggered state button.
                        DevelopmentHelpers.setButtonTriggeredState('FetchProductCategoriesButton', false);

                        // Tell the user that something went wrong while fetching product categories.
                        CustomMessage.showMessage('Възникна проблем при зареждане на категориите');

                        console.log($error);
                        return;
                    }

                    // Send the data to the select box.
                    // The triggered state of the button will be cleared there.
                    $self.fillSelectBoxWithProductCategories($data);
                }
            );
        },

        /**
         * Fills in the categories select box with all the categories
         * arriving from the database.
         *
         * @param $categories
         *
         * @return void
         */

        fillSelectBoxWithProductCategories($categories){

            const $self = this;

            if(!$self._productCategoriesSelectBox){

                $self._productCategoriesSelectBox = $('ProductCategoriesSelectBox');
            }

            if(!$self._productCategoriesSelectBox){

                // Make sure the button triggered state is cleared.
                DevelopmentHelpers.setButtonTriggeredState('FetchProductCategoriesButton', false);

                console.error('AdministrationPanelProductsCategories.fillSelectBoxWithProductCategories():' +
                    ' ProductCategoriesSelectBox is missing!');
                return;
            }

            // First clear the select box.
            $self._productCategoriesSelectBox.empty();

            // Add the default.
            let $defaultOption = document.createElement('option');
            $defaultOption.innerHTML = 'Избери твоята опция';
            $defaultOption.value = null;
            $defaultOption.selected = true;
            $defaultOption.disabled = true;
            $self._productCategoriesSelectBox.appendChild($defaultOption);

            // Add the rest.
            let $fragment = document.createDocumentFragment();
            for(let $member in $categories){

                if(!$categories.hasOwnProperty($member)){

                    continue;
                }

                let $option = document.createElement('option');
                $option.innerHTML = $categories[$member].display_name;

                // This is the ID of the category.
                $option.value = $member;
                $fragment.appendChild($option);
            }

            $self._productCategoriesSelectBox.appendChild($fragment);

            // Make sure the button triggered state is cleared.
            DevelopmentHelpers.setButtonTriggeredState('FetchProductCategoriesButton', false);
        },

        /**
         * Loads the details for a particular category from the database.
         *
         * @return void
         */

        loadCategoryDetails(){

            const $self = this;

            if(!$self._productCategoriesSelectBox){

                $self._productCategoriesSelectBox = $('ProductCategoriesSelectBox');
            }

            if(!$self._productCategoriesSelectBox){

                console.error('AdministrationPanelProductsCategories.loadCategoryDetails():' +
                    ' ProductCategoriesSelectBox is missing!');
                return;
            }

            // Make the request to get info for this category.
            let $pathNodes = ['products', 'categories_details', $self._productCategoriesSelectBox.value];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $extra = {};

            FirebaseDatabaseAndStorageManager.firebaseGET(
                $path,
                $extra,
                function ($error, $data) {

                    if($error){

                        // Tell the user that something went wrong while fetching category details.
                        CustomMessage.showMessage('Възникна проблем при зареждане на детайлти за категорията');

                        console.log($error);
                        return;
                    }

                    $self.fillFrontEndCategoryDetails($data);
                }
            );
        },

        /**
         * Shows category details on the front-end.
         *
         * @param $details
         *
         * @return void
         */

        fillFrontEndCategoryDetails($details){

            console.log($details);
        },

        /**
         * Makes sure that the name of a category can be changed and saved.
         *
         * @param $element
         *
         * @return void
         */

        categoryDetailsNameAllowChange($element){

            const $self = this;

            if(!$self._categoryDetailsNameSaveButton || !$self._categoryDetailsNameInput){

                $self._categoryDetailsNameInput = $('CategoryDetailsNameInput');
                $self._categoryDetailsNameSaveButton = $('CategoryDetailsNameSaveButton');
            }

            if(!$self._categoryDetailsNameSaveButton || !$self._categoryDetailsNameInput){

                console.error('AdministrationPanelProductsCategories.categoryDetailsNameAllowChange():' +
                    ' CategoryDetailsNameInput or CategoryDetailsNameSaveButton is missing!');
                return;
            }

            if($element.checked){

                $self._categoryDetailsNameInput.disabled = false;
                $self._categoryDetailsNameSaveButton.disabled = false;
                return;
            }

            $self._categoryDetailsNameInput.disabled = true;
            $self._categoryDetailsNameSaveButton.disabled = true;
        },

        saveCategoryDetailsName(){

            const $self = this;

            if(!$self._productCategoriesSelectBox){

                $self._productCategoriesSelectBox = $('ProductCategoriesSelectBox');
            }

            if(!$self._productCategoriesSelectBox){

                console.error('AdministrationPanelProductsCategories.saveCategoryDetailsName():' +
                    ' ProductCategoriesSelectBox is missing!');
                return;
            }

            CustomMessage.showMessage($self._productCategoriesSelectBox.value);
        }
    };

    return{

        init(){

            Logic.init();
        },

        showMe(){

            Logic.showMe();
        },

        hideMe(){

            Logic.hideMe();
        },

        fetchProductCategories(){

            Logic.fetchProductCategories();
        },

        loadCategoryDetails(){

            Logic.loadCategoryDetails();
        },

        categoryDetailsNameAllowChange($element){

            Logic.categoryDetailsNameAllowChange($element);
        },

        saveCategoryDetailsName(){

            Logic.saveCategoryDetailsName();
        }
    }
})();

document.addEvent('domready', function () {

    AdministrationPanelProductsCategories.init();
});