/**
 * @file administration_panel_products_side_bar.js
 *
 * AdministrationPanelProductsSideBar module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AdministrationPanelProductsSideBar = (function(){

    const Logic = {

        _templatePath: './Modules/AdministrationPanelProductsSideBar/administration_panel_products_side_bar.html',
        _placeholderName: 'AdministrationPanelProductsSideBarPlaceholder',
        _template: null,

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            // Go through defensive checks.
            if(!AdministrationPanelProductsCategories){

                console.error('AdministrationPanelProductsSideBar.init(): AdministrationPanelProductsCategories ' +
                    'is missing');
                return;
            }

            if(!AdministrationPanelProductsProducts){

                console.error('AdministrationPanelProductsSideBar.init(): AdministrationPanelProductsProducts ' +
                    'is missing');
                return;
            }

            const $self = this;
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
         * Makes sure that the chose undersection gets visible.
         *
         * @param $undersection
         *
         * @return void
         */

        showUndersection($undersection){

            const $self = this;

            switch ($undersection) {

                case 'categories':
                    $self.showCategoriesUndersection();
                    break;

                case 'products':
                    $self.showProductsUndersection();
                    break;
            }
        },

        /**
         * Makes categories undersection visible.
         * Makes products undersection invisible.
         *
         * @return void
         */

        showCategoriesUndersection(){

            AdministrationPanelProductsCategories.showMe();
            AdministrationPanelProductsProducts.hideMe();
        },

        /**
         * Makes products undersection visible.
         * Makes categories undersection invisible.
         *
         * @return void
         */

        showProductsUndersection(){

            AdministrationPanelProductsProducts.showMe();
            AdministrationPanelProductsCategories.hideMe();
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

        showUndersection($undersection){

            Logic.showUndersection($undersection);
        }
    }
})();

document.addEvent('domready', function () {

    AdministrationPanelProductsSideBar.init();
});