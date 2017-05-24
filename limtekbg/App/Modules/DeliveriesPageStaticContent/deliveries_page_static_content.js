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
        _templateFactory: null,

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const selfObj = this;

            selfObj._templateFactory = new TemplateFactory(
                selfObj._templatePath, selfObj._placeholderName, {}
            );

            selfObj._templateFactory.initProcess();
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