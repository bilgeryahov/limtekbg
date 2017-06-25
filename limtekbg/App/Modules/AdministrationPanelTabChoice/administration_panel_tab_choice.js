/**
 * @file administration_panel_tab_choice.js
 *
 * AdministrationPanelTabChoice module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AdministrationPanelTabChoice = (function(){

    const Logic = {

        _templatePath: './Modules/AdministrationPanelTabChoice/administration_panel_tab_choice.html',
        _placeholderName: 'AdministrationPanelTabChoicePlaceholder',
        _template: null,

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            // Go through the defensive checks.
            if(!AdministrationPanelProductsSideBar){

                console.error('AdministrationPanelTabChoice.init(): AdministrationPanelProductsSideBar ' +
                    'is missing');
                return;
            }

            if(!AdministrationPanelProductsCategories){

                console.error('AdministrationPanelTabChoice.init(): AdministrationPanelProductsCategories ' +
                    'is missing');
                return;
            }

            if(!AdministrationPanelProductsProducts){

                console.error('AdministrationPanelTabChoice.init(): AdministrationPanelProductsProducts ' +
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

            // At the beginning there is no section chosen.
            let $chosen_section = '';

            $self._template = new Template(
                $self._templatePath, $self._placeholderName, {chosen_section : $chosen_section}
            );

            $self._template.displayMain();
        },

        /**
         * Choose a tab to display.
         *
         * @param $tab
         *
         * @return void
         */

        chooseTab($tab){

            const $self = this;
            let $displayTab = 'В момента работите по раздел - ';

            switch ($tab) {

                case 'products':
                    $displayTab += 'Продукти';
                    $self.chooseProducts();
                    break;

                case 'purchases':
                    $displayTab += 'Поръчки';
                    $self.choosePurchases();
                    break;
            }

            $self._template.displayAfter( { chosen_tab : $displayTab } );
        },

        /**
         * Makes all the modules belonging to Products tab be desplayed.
         * Makes all the modules belonging to Purchases tab be hidden.
         *
         * @return void
         */

        chooseProducts(){

            // Show all.
            AdministrationPanelProductsSideBar.showMe();

            // Hide all.
        },

        /**
         * Makes all the modules belonging to Purchases tab be desplayed.
         * Makes all the modules belonging to Products tab be hidden.
         *
         * @return void
         */

        choosePurchases(){

            // Show all.

            // Hide all.
            AdministrationPanelProductsSideBar.hideMe();
            AdministrationPanelProductsCategories.hideMe();
            AdministrationPanelProductsProducts.hideMe();
        }
    };

    return{

        init(){

            Logic.init();
        },

        chooseTab($tab){

            Logic.chooseTab($tab);
        }
    }
})();

document.addEvent('domready', function () {

    AdministrationPanelTabChoice.init();
});