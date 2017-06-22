/**
 * @file administration_panel_products_categories.js
 *
 * AdministrationPanelProductsCategories module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.2.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AdministrationPanelProductsCategories = (function(){

    const Logic = {

        _templatePath: './Modules/AdministrationPanelProductsCategories/administration_panel_products_categories.html',
        _placeholderName: 'AdministrationPanelProductsCategoriesPlaceholder',
        _template: null,

        _productCategoriesList: null,

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
         * Gets called from the button on the front-end.
         * Gets called whenever a change is made.
         *
         * @return void
         */

        fetchProductCategories(){

            const $self = this;

            /*
             * Even though if the trigger is another function, make sure
             * that the button cannot be pressed.
             */

            DevelopmentHelpers.setButtonTriggeredState('FetchProductCategoriesButton', true);

            // Preparation. Lock the controls and clear all values.
            $self.categoryDetailsAllowChange( { checked : false } );
            $self.categoryDetailsClearValues();

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
                     * The product categories are being cached after each
                     * fetch process. So they can be used from other functions
                     * as well.
                     */

                    $self._productCategoriesList = $data;

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

            if(!$self.gatherDOMelements()){

                // Make sure the button triggered state is cleared.
                DevelopmentHelpers.setButtonTriggeredState('FetchProductCategoriesButton', false);
                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
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

            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
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
         * Fills in the parent category select box.
         *
         * @return void
         */

        fillParentCategorySelectBox(){

            const $self = this;

            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            // Check if there is product categories data.
            if(!$self._productCategoriesList){

                console.error('AdministrationPanelProductsCategories.fillParentCategorySelectBox(): ' +
                    ' The product details list has not been saved.');
                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            // Find the currently chosen category.
            let $currentChosenCategoryObj = null;

            for(let $member in $self._productCategoriesList){

                if(!$self._productCategoriesList.hasOwnProperty($member)){

                    continue;
                }

                // Check if this is the one on the main category select box at the top.
                if($member === $self._productCategoriesSelectBox.value){

                    // Found.
                    $currentChosenCategoryObj = $self._productCategoriesList[$member];
                    break;
                }
            }

            // Empty the old values.
            $self._categoryDetailsParentSelect.empty();

            // Create the default (chosen, parent).
            let $defaultOption = document.createElement('option');
            $defaultOption.selected = true;

            /*
             * We do not make this disabled, since
             * we want to make sure that if the user
             * clicks on the select box by mistake, they
             * can still choose the selected item itself.
             */

            // Find its parent.
            let $parentCategory = null;

            if(!$currentChosenCategoryObj.parent_id){

                // No parent.
                $defaultOption.innerHTML = 'Няма категория родител';
                $defaultOption.value = null;
            }
            else{

                // There is a parent.
                for(let $member in $self._productCategoriesList){

                    if(!$self._productCategoriesList.hasOwnProperty($member)){

                        continue;
                    }

                    // Is this my parent?
                    if($member === $currentChosenCategoryObj.parent_id){

                        // Cache the parent category.
                        $parentCategory = $self._productCategoriesList[$member];

                        // Set the values.
                        $defaultOption.innerHTML = $self._productCategoriesList[$member].display_name;
                        $defaultOption.value = $member;
                        break;
                    }
                }
            }

            // Append the parent.
            $self._categoryDetailsParentSelect.appendChild($defaultOption);

            // Add rest of the values (options).
            let $fragment = document.createDocumentFragment();

            for(let $member in $self._productCategoriesList){

                let $option = null;

                if(!$self._productCategoriesList.hasOwnProperty($member)){

                    continue;
                }

                // We do not want to see the current chosen one itself.
                if($self._productCategoriesList[$member] === $currentChosenCategoryObj){

                    continue;
                }

                // Make sure you do not take the parent.
                if($parentCategory && $self._productCategoriesList[$member] === $parentCategory){

                    /*
                     * There is a parent category.
                     * We want to make sure that the user has the
                     * option to remove it.
                     */

                    $option = document.createElement('option');
                    $option.innerHTML = 'Няма категория родител';
                    $option.value = null;
                    $fragment.appendChild($option);
                    continue;
                }

                $option = document.createElement('option');

                // The text of the option itself is the name of the category.
                $option.innerHTML = $self._productCategoriesList[$member].display_name;

                // This is the ID of the category.
                $option.value = $member;
                $fragment.appendChild($option);
            }

            // Append the rest.
            $self._categoryDetailsParentSelect.appendChild($fragment);
        },

        /**
         * Shows category details on the front-end.
         *
         * @param $details
         *
         * @return void
         *
         * @StillToImplement
         */

        fillFrontEndCategoryDetails($details){

            const $self = this;

            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            $self._categoryDetailsNameInput.value = $details.display_name;
            $self.fillParentCategorySelectBox();
            // TODO: Add the rest of the elements.
        },

        /**
         * Makes sure that the details of a category can be changed and saved.
         *
         * @param $element
         *
         * @return void
         *
         * @StillToFinish
         */

        categoryDetailsAllowChange($element){

            const $self = this;

            /*
             * Make sure if the call for this function comes from
             * another function, but not the checkbox itself,
             * the checkbox gets also the value of the element passed
             * as parameter.
             */

            if($element.id !== 'CategoryDetailsAllowChangeCheckbox'){

                $('CategoryDetailsAllowChangeCheckbox').checked = $element.checked;
            }

            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            if($element.checked){

                $self._categoryDetailsNameInput.disabled = false;
                $self._categoryDetailsNameSaveButton.disabled = false;
                $self._categoryDetailsParentSelect.disabled = false;
                $self._categoryDetailsParentSaveButton.disabled = false;
                // TODO: Add the rest.
                return;
            }

            $self._categoryDetailsNameInput.disabled = true;
            $self._categoryDetailsNameSaveButton.disabled = true;
            $self._categoryDetailsParentSelect.disabled = true;
            $self._categoryDetailsParentSaveButton.disabled = true;
            // TODO: Add the rest.
        },

        /**
         * Clears the values of all the category detail elements.
         *
         * @return void
         *
         * @stillToImplement
         */

        categoryDetailsClearValues(){

            const $self = this;

            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            $self._categoryDetailsNameInput.value = null;
            $self._categoryDetailsParentSelect.empty();
            // TODO: Add the rest.
        },

        /**
         * Saves new name for a category.
         *
         * @return void
         */

        saveCategoryDetailsName(){

            const $self = this;

            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            /*
             * Since while saving an object we need it as a whole,
             * we need to take it from the list here.
             */

            if(!$self._productCategoriesList){

                console.error('AdministrationPanelProductsCategories.saveCategoryDetailsName(): ' +
                    ' The product details list has not been saved.');
                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
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

            // Find the currently chosen category.
            let $currentChosenCategoryObj = null;

            for(let $member in $self._productCategoriesList){

                if(!$self._productCategoriesList.hasOwnProperty($member)){

                    continue;
                }

                // Check if this is the one on the main category select box at the top.
                if($member === $self._productCategoriesSelectBox.value){

                    // Found.
                    $currentChosenCategoryObj = $self._productCategoriesList[$member];
                    break;
                }
            }

            // Save the name.
            let $pathNodes = ['products', 'categories_details', $self._productCategoriesSelectBox.value];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $putData = $currentChosenCategoryObj;

            // Change the new value.
            $putData.display_name = $self._categoryDetailsNameInput.value;

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

                    // After a successful save, update the products.
                    $self.fetchProductCategories();

                    console.log($data);
                }
            );
        },

        /**
         * Saves new parent category for a
         * selected category.
         *
         * @return void
         */

        saveCategoryDetailsParent(){

            const $self = this;

            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            /*
             * Since while saving an object we need it as a whole,
             * we need to take it from the list here.
             */

            if(!$self._productCategoriesList){

                console.error('AdministrationPanelProductsCategories.saveCategoryDetailsParent(): ' +
                    ' The product details list has not been saved.');
                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            // Check if there is actually a chosen category.
            // TODO: Very dirty solution 'null'.
            if($self._productCategoriesSelectBox.value === 'null' ||
                !$self._productCategoriesSelectBox.value ||
                typeof $self._productCategoriesSelectBox.value === 'undefined'){

                CustomMessage.showMessage('Изберете категория!');
                console.log('AdministrationPanelProductsCategories.saveCategoryDetailsParent(): '
                    + ' No category chosen to have parent category saved!');
                return;
            }

            /*
             * Check if there is parent category selected.
             * This check is more specific, since 'null' as value
             * will be accepted.
             * This means to delete the parent category.
             */

            if($self._categoryDetailsParentSelect.innerHTML === '' ||
                typeof $self._categoryDetailsParentSelect.value === 'undefined'){

                CustomMessage.showMessage('Изберете категория родител!');
                console.log('AdministrationPanelProductsCategories.saveCategoryDetailsParent(): '
                    + ' No new parent category chosen to be saved!');
                return;
            }

            //Make sure the button indicates.
            DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsParentSaveButton', true);

            // Find the currently chosen category.
            let $currentChosenCategoryObj = null;

            for(let $member in $self._productCategoriesList){

                if(!$self._productCategoriesList.hasOwnProperty($member)){

                    continue;
                }

                // Check if this is the one on the main category select box at the top.
                if($member === $self._productCategoriesSelectBox.value){

                    // Found.
                    $currentChosenCategoryObj = $self._productCategoriesList[$member];
                    break;
                }
            }

            // Save the parent id.
            let $pathNodes = ['products', 'categories_details', $self._productCategoriesSelectBox.value];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $putData = $currentChosenCategoryObj;

            /*
             * TODO: Following:
             * null value in a select box gets converted to a string...
             */

            if($self._categoryDetailsParentSelect.value === 'null' ||
                $self._categoryDetailsParentSelect.value === null){

                $putData.parent_id = null;
            }
            else{

                $putData.parent_id = $self._categoryDetailsParentSelect.value;
            }

            FirebaseDatabaseAndStorageManager.firebasePUT(
                $path,
                $putData,
                function ($error, $data) {

                    if($error){

                        // Clear button triggered state.
                        DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsParentSaveButton', false);

                        console.log($error);
                        CustomMessage.showMessage('Проблем при записване на новата категория родител.');
                        return;
                    }

                    // Clear button triggered state.
                    DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsParentSaveButton', false);
                    CustomMessage.showMessage('Промените Ви са успешно записани');

                    // After a successful save, update the products.
                    $self.fetchProductCategories();

                    console.log($data);
                }
            );
        },

        /**
         * Gathers all the elements from the DOM. Usually each element should
         * be cached after the initial fetch, so this function should not
         * be a time-consuming operation.
         *
         * @return {boolean}
         */

        gatherDOMelements(){

            const $self = this;

            if(!$self._productCategoriesSelectBox){

                $self._productCategoriesSelectBox = $('ProductCategoriesSelectBox');
            }

            if(!$self._productCategoriesSelectBox){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'ProductCategoriesSelectBox is missing!');
                return false;
            }

            if(!$self._categoryDetailsNameInput){

                $self._categoryDetailsNameInput = $('CategoryDetailsNameInput');
            }

            if(!$self._categoryDetailsNameInput){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDetailsNameInput is missing!');
                return false;
            }

            if(!$self._categoryDetailsNameSaveButton){

                $self._categoryDetailsNameSaveButton = $('CategoryDetailsNameSaveButton');
            }

            if(!$self._categoryDetailsNameSaveButton){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDetailsNameSaveButton is missing!');
                return false;
            }

            if(!$self._categoryDetailsParentSelect){

                $self._categoryDetailsParentSelect = $('CategoryDetailsParentSelect');
            }

            if(!$self._categoryDetailsParentSelect){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDetailsParentSelect is missing!');
                return false;
            }

            if(!$self._categoryDetailsParentSaveButton){

                $self._categoryDetailsParentSaveButton = $('CategoryDetailsParentSaveButton');
            }

            if(!$self._categoryDetailsParentSaveButton){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDetailsParentSaveButton is missing!');
                return false;
            }

            // TODO: Add rest of the elements.

            return true;
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
        },

        saveCategoryDetailsParent(){

            Logic.saveCategoryDetailsParent();
        }
    }
})();

document.addEvent('domready', function () {

    AdministrationPanelProductsCategories.init();
});