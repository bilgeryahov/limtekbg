/**
 * @file administration_panel_products_categories.js
 *
 * AdministrationPanelProductsCategories module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.1.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AdministrationPanelProductsCategories = (function(){

    const Logic = {

        _templatePath: './Modules/AdministrationPanelProductsCategories/administration_panel_products_categories.html',
        _placeholderName: 'AdministrationPanelProductsCategoriesPlaceholder',
        _template: null,

        // Below the attributes are grouped.
        _productCategoriesSelectBox : null,

        _categoryDetailsNameInput: null,
        _categoryDetailsNameSaveButton: null,

        _categoryDetailsParentSelect: null,
        _categoryDetailsParentSaveButton: null,

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

                    /*
                     * Send the data to the select box.
                     * The triggered state of the button will be cleared there.
                     */

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
                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
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

                // The text of the option itself is the name of the category.
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

            /*
             * This check might kick-in only in case that the select box does not carry
             * the ID.
             */

            if(!$self._productCategoriesSelectBox){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                console.error('AdministrationPanelProductsCategories.loadCategoryDetails():' +
                    ' ProductCategoriesSelectBox does not carry the needed ID!');
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
         * This function goes through a set of defensive checks
         * to make sure that all the populated front-end items
         * are actually present.
         *
         * In case of missing front-end elements, the process
         * will not continue. The user will be informed and
         * correct console error will be shown.
         *
         * @param $details
         *
         * @return void
         *
         * @StillToImplement
         */

        fillFrontEndCategoryDetails($details){

            const $self = this;

            if(!$self._categoryDetailsNameInput){

                $self._categoryDetailsNameInput = $('CategoryDetailsNameInput');
            }

            if(!$self._categoryDetailsNameInput){

                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
                console.error('AdministrationPanelProductsCategories.fillFrontEndCategoryDetails():' +
                    ' CategoryDetailsNameInput is missing!');
                return;
            }

            // TODO: Add the rest of the elements, which are needed for the change process.

            $self._categoryDetailsNameInput.value = $details.display_name;
        },

        /**
         * Makes sure that the details of a category can be changed and saved.
         *
         * This function takes all the elements from the DOM,
         * which will be needed to successfully perform a change.
         *
         * In case of missing front-end elements, the process
         * will not continue. The user will be informed and
         * correct console error will be shown.
         *
         * @param $element
         *
         * @return void
         *
         * @StillToFinish
         */

        categoryDetailsAllowChange($element){

            const $self = this;

            if(!$self._categoryDetailsNameSaveButton){

                $self._categoryDetailsNameSaveButton = $('CategoryDetailsNameSaveButton');
            }

            if(!$self._categoryDetailsNameSaveButton){

                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
                console.error('AdministrationPanelProductsCategories.categoryDetailsNameAllowChange():' +
                    ' CategoryDetailsNameSaveButton is missing!');
                return;
            }

            if(!$self._categoryDetailsNameInput){

                $self._categoryDetailsNameInput = $('CategoryDetailsNameInput');
            }

            if(!$self._categoryDetailsNameInput){

                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
                console.error('AdministrationPanelProductsCategories.categoryDetailsNameAllowChange():' +
                    ' CategoryDetailsNameInput is missing!');
                return;
            }

            if(!$self._categoryDetailsParentSaveButton){

                $self._categoryDetailsParentSaveButton = $('CategoryDetailsParentSaveButton');
            }

            if(!$self._categoryDetailsParentSaveButton){

                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
                console.error('AdministrationPanelProductsCategories.categoryDetailsNameAllowChange():' +
                    ' CategoryDetailsParentSaveButton is missing!');
                return;
            }

            if(!$self._categoryDetailsParentSelect){

                $self._categoryDetailsParentSelect = $('CategoryDetailsParentSelect');
            }

            if(!$self._categoryDetailsParentSelect){

                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
                console.error('AdministrationPanelProductsCategories.categoryDetailsNameAllowChange():' +
                    ' CategoryDetailsParentSelect is missing!');
                return;
            }

            // TODO: Add the rest of the elements, which are needed for the change process.

            if($element.checked){

                // TODO: Add the rest.

                $self._categoryDetailsNameInput.disabled = false;
                $self._categoryDetailsNameSaveButton.disabled = false;
                $self._categoryDetailsParentSelect.disabled = false;
                $self._categoryDetailsParentSaveButton.disabled = false;
                return;
            }

            // TODO: Add the rest.

            $self._categoryDetailsNameInput.disabled = true;
            $self._categoryDetailsNameSaveButton.disabled = true;
            $self._categoryDetailsParentSelect.disabled = true;
            $self._categoryDetailsParentSaveButton.disabled = true;
        },

        /**
         * Saves new name for a category.
         *
         * @return void
         */

        saveCategoryDetailsName(){

            const $self = this;

            if(!$self._productCategoriesSelectBox){

                $self._productCategoriesSelectBox = $('ProductCategoriesSelectBox');
            }

            if(!$self._productCategoriesSelectBox){

                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
                console.error('AdministrationPanelProductsCategories.saveCategoryDetailsName():' +
                    ' ProductCategoriesSelectBox is missing!');
                return;
            }

            if(!$self._categoryDetailsNameSaveButton || !$self._categoryDetailsNameInput){

                $self._categoryDetailsNameInput = $('CategoryDetailsNameInput');
                $self._categoryDetailsNameSaveButton = $('CategoryDetailsNameSaveButton');
            }

            if(!$self._categoryDetailsNameSaveButton || !$self._categoryDetailsNameInput){

                CustomMessage.showMessage('Възникна проблем. Моля обновете страницата.');
                console.error('AdministrationPanelProductsCategories.saveCategoryDetailsName():' +
                    ' CategoryDetailsNameInput or CategoryDetailsNameSaveButton is missing!');
                return;
            }

            // Check if there is actually a chosen category.
            // Very dirty solution 'null'.
            if($self._productCategoriesSelectBox.value === 'null' ||
                !$self._productCategoriesSelectBox.value ||
                 typeof $self._productCategoriesSelectBox.value === 'undefined'){

                CustomMessage.showMessage('Изберете категория!');
                console.log('AdministrationPanelProductsCategories.saveCategoryDetailsName(): '
                 + ' No category chosen to have name saved!');
                return;
            }

            // Check if there is a name entered.
            if($self._categoryDetailsNameInput.value === '' ||
                $self._categoryDetailsNameInput.value === null ||
                 typeof $self._categoryDetailsNameInput.value === 'undefined'){

                CustomMessage.showMessage('Въведете име!');
                console.log('AdministrationPanelProductsCategories.saveCategoryDetailsName(): '
                    + ' No new name chosen to be saved!');
                return;
            }

            //Make sure the button indicates.
            DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsNameSaveButton', true);

            // Save the name.
            let $pathNodes = ['products', 'categories_details', $self._productCategoriesSelectBox.value];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $putData = {
                display_name : $self._categoryDetailsNameInput.value
            };

            FirebaseDatabaseAndStorageManager.firebasePUT(
                $path,
                $putData,
                function ($error, $data) {

                    if($error){

                        // Clear button triggered state.
                        DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsNameSaveButton', false);

                        console.log($error);
                        CustomMessage.showMessage('Проблем при записване на новото име');
                        return;
                    }

                    // Clear button triggered state.
                    DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsNameSaveButton', false);
                    CustomMessage.showMessage('Промените Ви са успешно записани');
                    console.log($data);
                }
            );
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

        categoryDetailsAllowChange($element){

            Logic.categoryDetailsAllowChange($element);
        },

        saveCategoryDetailsName(){

            Logic.saveCategoryDetailsName();
        }
    }
})();

document.addEvent('domready', function () {

    AdministrationPanelProductsCategories.init();
});