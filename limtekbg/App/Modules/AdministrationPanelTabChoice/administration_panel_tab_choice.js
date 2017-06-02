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
         * Choose a section to display.
         *
         * @param $section
         *
         * @return void
         */

        chooseSection($section){

            const $self = this;
            let $displaySection = '';

            switch ($section) {

                case 'products':
                    $displaySection = 'Продукти';
                    break;

                case 'purchases':
                    $displaySection = 'Поръчки';
                    break;
            }

            $self._template.displayAfter( { chosen_section : $displaySection } );
        }
    };

    return{

        init(){

            Logic.init();
        },

        chooseSection($section){

            Logic.chooseSection($section);
        }
    }
})();

document.addEvent('domready', function () {

    AdministrationPanelTabChoice.init();
});