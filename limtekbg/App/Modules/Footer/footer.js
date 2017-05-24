/**
 * @file footer.js
 *
 * Footer module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const Footer = (function(){

    const Logic = {

        _templatePath: './Modules/Footer/footer.html',
        _placeholderName: 'FooterPlaceholder',
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

    Footer.init();
});