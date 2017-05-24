/**
 * @file Loader.js
 *
 * Loader module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const Loader = (function(){

    const Logic = {

        _templatePath: './Modules/Loader/loader.html',
        _placeholderName: 'LoaderPlaceholder',
        _flexibleTemplateFactory: null,

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const selfObj = this;

            selfObj._flexibleTemplateFactory = new FlexibleTemplateFactory(
                selfObj._templatePath, selfObj._placeholderName, {}
            );

            selfObj._flexibleTemplateFactory.initProcess();
        },

        /**
         * Show the Loader spinning.
         *
         * @return void
         */

        showMe(){

            const selfObj = this;
            selfObj._flexibleTemplateFactory.showPlaceholder();
        },

        /**
         * Hide the Loader.
         *
         * @return void
         */

        hideMe(){

            const selfObj = this;
            selfObj._flexibleTemplateFactory.hidePlaceholder();
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
        }
    }
})();

document.addEvent('domready', function () {

    Loader.init();
});