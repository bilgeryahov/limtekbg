/**
 * @file custom_message.js
 *
 * CustomMessage module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const CustomMessage = (function(){

    const Logic = {

        _templatePath: './Modules/CustomMessage/custom_message.html',
        _placeholderName: 'CustomMessagePlaceholder',
        _flexibleTemplateFactory: null,

        /**
         * Initialize the CustomMessage module.
         *
         * @return void
         */

        init(){

            if(!Handlebars){

                console.error('CustomMessage.init(): Handlebars is not present!');
                return;
            }

            const selfObj = this;

            selfObj._flexibleTemplateFactory = new FlexibleTemplateFactory(
                selfObj._templatePath, selfObj._placeholderName, {}
            );
        },

        /**
         * Show a message to the user.
         *
         * @param message
         *
         * @return void
         */

        showMessage(message){

            const selfObj = this;
            selfObj._flexibleTemplateFactory.addCustomTemplateData( { message : message } );
            selfObj._flexibleTemplateFactory.initProcess();
            selfObj._flexibleTemplateFactory.showPlaceholder();
        },

        /**
         * Hides the message box.
         *
         * @return void
         */

        hideMessage(){

            const selfObj = this;
            selfObj._flexibleTemplateFactory.hidePlaceholder();
        }
    };

    return{

        init(){

            Logic.init();
        },

        showMessage(message){

            Logic.showMessage(message);
        },

        hideMessage(){

            Logic.hideMessage();
        }
    }
})();

document.addEvent('domready', function () {

    CustomMessage.init();
});