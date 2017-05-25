/**
 * @file deliveries_page_static_content.js
 *
 * DeliveriesPageStaticContent module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const DeliveriesPageStaticContent = (function(){

    const Logic = {

        _templatePath: './Modules/DeliveriesPageStaticContent/deliveries_page_static_content.html',
        _placeholderName: 'DeliveriesPageStaticContentPlaceholder',
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

            $self._template = new Template(
                $self._templatePath, $self._placeholderName, {}
            );

            $self._template.displayMain();
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function () {

    DeliveriesPageStaticContent.init();
});