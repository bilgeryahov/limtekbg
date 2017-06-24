/**
 * @file administration_panel_products_categories.js
 *
 * AdministrationPanelProductsCategories module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 2.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AdministrationPanelProductsCategories = (function(){

    const Logic = {

        _templatePath: './Modules/AdministrationPanelProductsCategories/administration_panel_products_categories.html',
        _placeholderName: 'AdministrationPanelProductsCategoriesPlaceholder',
        _template: null,

        _allDOMelementsPresent: false,

        _productCategoriesList: null,

        // Below the attributes are grouped.

        _categoryNewNameInput: null,
        _categorNewCreateButton: null,

        _productCategoriesSelectBox : null,

        _categoryDetailsNameInput: null,
        _categoryDetailsParentSelect: null,
        _categoryDetailsSubcategories: null,
        _categoryDetailsSaveButton: null,

        _categoryForDelete: null,
        _categoryDeleteButton: null,

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

            // First clear all values.
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

                        console.error($error);
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

            // If you use DOM elements, make sure they are OKAY!
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

            // Make sure that this option cannot be checked again.
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

            // If you use DOM elements, make sure they are OKAY!
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
                        console.error($error);
                        return;
                    }

                    // First clear whatever is there.
                    $self.categoryDetailsClearValues();

                    // Then fill.
                    $self.fillFrontEndCategoryDetails($data);
                }
            );
        },

        /**
         * Fills in the parent category select box.
         *
         * @param $details
         *
         * @return void
         */

        fillParentCategorySelectBox($details){

            const $self = this;

            // If you use DOM elements, make sure they are OKAY!
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

            // Empty the old values.
            $self._categoryDetailsParentSelect.empty();

            // Create the default (chosen, parent).
            let $parentCategory = null;

            let $defaultOption = document.createElement('option');
            $defaultOption.selected = true;

            /*
             * We do not make this disabled, since
             * we want to make sure that if the user
             * clicks on the select box by mistake, they
             * can still choose the selected item itself.
             */

            if(!$details.parent_id){

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
                    if($member === $details.parent_id){

                        // Cache the parent category.
                        $parentCategory = $self._productCategoriesList[$member];

                        // Set the values.
                        $defaultOption.innerHTML = $parentCategory.display_name;

                        // The ID of the parent.
                        $defaultOption.value = $member;
                        break;
                    }
                }
            }

            // Append the parent (or the no-parent option).
            $self._categoryDetailsParentSelect.appendChild($defaultOption);

            // Add rest of the values (options).
            let $fragment = document.createDocumentFragment();

            for(let $member in $self._productCategoriesList){

                if(!$self._productCategoriesList.hasOwnProperty($member)){

                    continue;
                }

                // We do not want to see the current chosen one itself.
                if($self._productCategoriesList[$member] === $details){

                    continue;
                }

                // Now we are sure we can create the option.
                let $option = document.createElement('option');

                // Make sure you do not take the parent.
                if($parentCategory && $self._productCategoriesList[$member] === $parentCategory){

                    /*
                     * There is a parent category.
                     * We want to make sure that the user has the
                     * option to remove it.
                     */

                    $option.innerHTML = 'Няма категория родител';
                    $option.value = null;
                    $fragment.appendChild($option);
                    continue;
                }

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
         * Fills in the list with sub-categories of a category.
         *
         * @return void
         */

        fillSubcategoriesList(){

            const $self = this;

            // If you use DOM elements, make sure they are OKAY!
            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            // Check if there is product categories data.
            if(!$self._productCategoriesList){

                console.error('AdministrationPanelProductsCategories.fillSubcategoriesList(): ' +
                    ' The product details list has not been saved.');
                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            // Get the current chosen category's ID.
            let $currentChosenCategoryID = $self._productCategoriesSelectBox.value;

            // Find all the categories, which have this category as a parent.
            let $subcategories = [];

            for(let $member in $self._productCategoriesList){

                if(!$self._productCategoriesList.hasOwnProperty($member)){

                    continue;
                }

                if($self._productCategoriesList[$member].parent_id === $currentChosenCategoryID){

                    $subcategories.push($self._productCategoriesList[$member].display_name);
                }
            }

            // If there are no categories, with parent the current chosen category.
            if($subcategories.length === 0){

                $subcategories.push('Тази категория няма под-категории');
            }

            // Empty the UL first.
            $self._categoryDetailsSubcategories.empty();

            // For each subcategory, create a LI element.
            $subcategories.forEach(function ($element) {

                let $li = document.createElement('li');
                $li.innerHTML = $element;
                $self._categoryDetailsSubcategories.appendChild($li);
            });
        },

        /**
         * Shows category details on the front-end.
         *
         * @param $details
         *
         * @return void
         */

        fillFrontEndCategoryDetails($details){

            const $self = this;

            // If you use DOM elements, make sure they are OKAY!
            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            $self._categoryDetailsNameInput.value = $details.display_name;
            $self.fillParentCategorySelectBox($details);
            $self.fillSubcategoriesList();
        },

        /**
         * Clears the values of all the category detail elements.
         *
         * @return void
         */

        categoryDetailsClearValues(){

            const $self = this;

            // If you use DOM elements, make sure they are OKAY!
            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            $self._categoryDetailsNameInput.value = null;
            $self._categoryDetailsParentSelect.empty();
            $self._categoryDetailsSubcategories.empty();
            $self._categoryForDelete.value = null;
        },

        /**
         * Saves new data (details) for a category.
         *
         * @return void
         */

        saveCategoryDetails(){

            const $self = this;

            // If you use DOM elements, make sure they are OKAY!
            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            /*
             * Check if there is a selected category.
             * Not very comfortable to work with, but if the
             * value of the 'option' element is null, then the value
             * of the 'select' element gets 'null' as string.
             */

            if($self._productCategoriesSelectBox.value === 'null' ||
                !$self._productCategoriesSelectBox.value ||
                 typeof $self._productCategoriesSelectBox.value === 'undefined'){

                CustomMessage.showMessage('Изберете категория!');
                console.log('AdministrationPanelProductsCategories.saveCategoryDetails(): '
                 + ' No category chosen to have details changed!');
                return;
            }

            // Check if there is a name entered.
            if($self._categoryDetailsNameInput.value === '' ||
                $self._categoryDetailsNameInput.value === null ||
                 typeof $self._categoryDetailsNameInput.value === 'undefined'){

                CustomMessage.showMessage('Въведете име!');
                console.log('AdministrationPanelProductsCategories.saveCategoryDetails(): '
                    + ' No new name chosen to be saved!');
                return;
            }

            /*
             * Check if there is parent category selected.
             * This check is more specific, since 'null' as value
             * will be accepted.
             * This means to delete the parent category.
             */

            if($self._categoryDetailsParentSelect.value === '' ||
                typeof $self._categoryDetailsParentSelect.value === 'undefined'){

                CustomMessage.showMessage('Изберете категория родител!');
                console.log('AdministrationPanelProductsCategories.saveCategoryDetails(): '
                    + ' No new parent category chosen to be saved!');
                return;
            }

            //Make sure the button indicates.
            DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsSaveButton', true);

            // Save new data.
            let $pathNodes = ['products', 'categories_details', $self._productCategoriesSelectBox.value];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $putData = {};

            // Change the name to the new value.
            $putData.display_name = $self._categoryDetailsNameInput.value;

            /*
             * Change the parent to the new value.
             * Null value in a select box gets converted to a string.
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
                        DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsSaveButton', false);

                        console.error($error);
                        CustomMessage.showMessage('Проблем при записване на новите детайли.');
                        return;
                    }

                    // Clear button triggered state.
                    DevelopmentHelpers.setButtonTriggeredState('CategoryDetailsSaveButton', false);
                    CustomMessage.showMessage('Промените Ви са успешно записани');

                    // After a successful save, update the products.
                    $self.fetchProductCategories();

                    console.log($data);
                }
            );
        },

        /**
         * Deletes a particular category.
         *
         * (Performs multi-location update, not a DELETE
         * since we never know if the category is actually
         * parent for other ones.
         *
         * @return void
         */

        deleteCategory(){

            const $self = this;

            // If you use DOM elements, make sure they are OKAY!
            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            /*
             * Since while modifying an object we need it as a whole,
             * we need to take it from the list here.
             */

            if(!$self._productCategoriesList){

                console.error('AdministrationPanelProductsCategories.deleteCategory(): ' +
                    ' The product details list has not been saved.');
                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            /*
             * Check if there is a selected category.
             * Not very comfortable to work with, but if the
             * value of the 'option' element is null, then the value
             * of the 'select' element gets 'null' as string.
             */

            if($self._productCategoriesSelectBox.value === 'null' ||
                !$self._productCategoriesSelectBox.value ||
                typeof $self._productCategoriesSelectBox.value === 'undefined'){

                CustomMessage.showMessage('Изберете категория!');
                console.log('AdministrationPanelProductsCategories.deleteCategory(): '
                    + ' No category chosen to be deleted!');
                return;
            }

            // Check if there is a name confirmed.
            if($self._categoryForDelete.value === '' ||
                $self._categoryForDelete.value === null ||
                typeof $self._categoryForDelete.value === 'undefined' ||
                $self._categoryForDelete.value !==
                $self._productCategoriesSelectBox.options[$self._productCategoriesSelectBox.selectedIndex].innerHTML){

                CustomMessage.showMessage('Потвърдете името на категорията за изтриване!');
                console.log('AdministrationPanelProductsCategories.deleteCategory(): '
                    + ' No name confirmed to be deleted!');
                return;
            }

            //Make sure the button indicates.
            DevelopmentHelpers.setButtonTriggeredState('CategoryDeleteButton', true);

            // Since we will be performing multi-location update, we need to combine them together.
            let $locationUpdatePairs = {};

            // Delete the category (Main update).
            let $pathNodes = ['products', 'categories_details', $self._productCategoriesSelectBox.value];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $putData = null;

            // Add the main update.
            $locationUpdatePairs[$path] = $putData;

            // Now all the dependent sub-categories (cascade updates).
            let $currentChosenCategoryID = $self._productCategoriesSelectBox.value;

            // Find all the categories, which have this category as a parent.
            let $subcategories = {};

            for(let $member in $self._productCategoriesList){

                if(!$self._productCategoriesList.hasOwnProperty($member)){

                    continue;
                }

                if($self._productCategoriesList[$member].parent_id === $currentChosenCategoryID){

                    $subcategories[$member] = ($self._productCategoriesList[$member]);
                }
            }

            // Prepare all the sub-category updates.
            for(let $member in $subcategories){

                if(!$subcategories.hasOwnProperty($member)){

                    continue;
                }

                $pathNodes = ['products', 'categories_details', $member];
                $path = DevelopmentHelpers.constructPath($pathNodes);

                // Always use the whole object.
                $putData = $subcategories[$member];

                // Delete the parent.
                $putData.parent_id = null;

                // Add to the combination.
                $locationUpdatePairs[$path] = $putData;
            }

            // Fire the update.
            FirebaseDatabaseAndStorageManager.firebasePerformMultiLocationUpdate(
                $locationUpdatePairs,
                function ($error, $data) {

                    if($error){

                        // Clear button triggered state.
                        DevelopmentHelpers.setButtonTriggeredState('CategoryDeleteButton', false);

                        console.error($error);
                        CustomMessage.showMessage('Проблем при изтриването на категорията');
                        return;
                    }

                    // Clear button triggered state.
                    DevelopmentHelpers.setButtonTriggeredState('CategoryDeleteButton', false);
                    CustomMessage.showMessage('Категорията е успешно изтрита');

                    // After a successful save, update the products.
                    $self.fetchProductCategories();

                    console.log($data);
                }
            );
        },

        /**
         * Creates a new category entry in the Databse.
         *
         * @return void
         */

        createNewCategory(){

            const $self = this;

            // If you use DOM elements, make sure they are OKAY!
            if(!$self.gatherDOMelements()){

                CustomMessage.showMessage('Възникна грешка. Извиняваме се за неудобството.');
                return;
            }

            // Check if there is value inside the textbox.
            if($self._categoryNewNameInput.value === '' ||
                typeof $self._categoryNewNameInput.value === 'undefined' ||
                $self._categoryNewNameInput.value === null){

                CustomMessage.showMessage('Въведете име за новата категория!');
                console.log('AdministrationPanelProductsCategories.createNewCategory(): '
                    + ' No category name chosen for creation!');
                return;
            }

            DevelopmentHelpers.setButtonTriggeredState('CategorNewCreateButton', true);

            // Create the DB entry.
            let $pathNodes = ['products', 'categories_details'];
            let $path = DevelopmentHelpers.constructPath($pathNodes);
            let $postData = {
              display_name : $self._categoryNewNameInput.value
            };

            FirebaseDatabaseAndStorageManager.firebasePOST(
                $path,
                $postData,
                function ($error, $data) {

                    if($error){

                        // Clear button triggered state.
                        DevelopmentHelpers.setButtonTriggeredState('CategorNewCreateButton', false);

                        // Now clear the input value.
                        $self._categoryNewNameInput.value = '';

                        console.error($error);
                        CustomMessage.showMessage('Проблем при създаването на новата категория.');
                        return;
                    }

                    // Clear button triggered state.
                    DevelopmentHelpers.setButtonTriggeredState('CategorNewCreateButton', false);

                    // Now clear the input value.
                    $self._categoryNewNameInput.value = '';

                    CustomMessage.showMessage('Категорията е успешно създадена.');

                    // After a successful save, update the products.
                    $self.fetchProductCategories();

                    console.log($data);
                }
            );
        },

        /**
         * Fetches all the DOM elements.
         *
         * If the function executes properly and fetches all DOM elements,
         * the _allDOMelementsPresent flag is set to true, so this function
         * does not take execution time anymore.
         *
         * @return {boolean}
         */

        gatherDOMelements(){

            const $self = this;

            if($self._allDOMelementsPresent){

                return true;
            }

            if(!$self._categorNewCreateButton){

                $self._categorNewCreateButton = $('CategorNewCreateButton');
            }

            if(!$self._categorNewCreateButton){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategorNewCreateButton is missing!');
                return false;
            }

            if(!$self._categoryNewNameInput){

                $self._categoryNewNameInput = $('CategoryNewNameInput');
            }

            if(!$self._categoryNewNameInput){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryNewNameInput is missing!');
                return false;
            }

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

            if(!$self._categoryDetailsParentSelect){

                $self._categoryDetailsParentSelect = $('CategoryDetailsParentSelect');
            }

            if(!$self._categoryDetailsParentSelect){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDetailsParentSelect is missing!');
                return false;
            }

            if(!$self._categoryDetailsSubcategories){

                $self._categoryDetailsSubcategories = $('CategoryDetailsSubcategories');
            }

            if(!$self._categoryDetailsSubcategories){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDetailsSubcategories is missing!');
                return false;
            }

            if(!$self._categoryDetailsSaveButton){

                $self._categoryDetailsSaveButton = $('CategoryDetailsSaveButton');
            }

            if(!$self._categoryDetailsSaveButton){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDetailsSaveButton is missing!');
                return false;
            }

            if(!$self._categoryForDelete){

                $self._categoryForDelete = $('CategoryForDelete');
            }

            if(!$self._categoryForDelete){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryForDelete is missing!');
                return false;
            }

            if(!$self._categoryDeleteButton){

                $self._categoryDeleteButton = $('CategoryDeleteButton');
            }

            if(!$self._categoryDeleteButton){

                console.error('AdministrationPanelProductsCategories.gatherDOMelements(): ' +
                    'CategoryDeleteButton is missing!');
                return false;
            }

            /*
             * Once all DOM elements are cached, make sure
             * that this operation stops.
             */

            $self._allDOMelementsPresent = true;

            // Finish
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

        saveCategoryDetails(){

            Logic.saveCategoryDetails();
        },

        deleteCategory(){

            Logic.deleteCategory();
        },

        createNewCategory(){

            Logic.createNewCategory();
        }
    }
})();

document.addEvent('domready', function () {

    AdministrationPanelProductsCategories.init();
});