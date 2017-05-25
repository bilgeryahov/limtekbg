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

            const $self = this;

            $self._flexibleTemplateFactory = new FlexibleTemplateFactory(
                $self._templatePath, $self._placeholderName, {}
            );
        },

        /**
         * Show a message to the user.
         *
         * @param $message
         *
         * @return void
         */

        showMessage($message){

            const $self = this;
            $self._flexibleTemplateFactory.addCustomTemplateData( { message : $message } );
            $self._flexibleTemplateFactory.initProcess();
            $self._flexibleTemplateFactory.showPlaceholder();
        },

        /**
         * Hides the message box.
         *
         * @return void
         */

        hideMessage(){

            const $self = this;
            $self._flexibleTemplateFactory.hidePlaceholder();
        }
    };

    return{

        init(){

            Logic.init();
        },

        showMessage($message){

            Logic.showMessage($message);
        },

        hideMessage(){

            Logic.hideMessage();
        }
    }
})();

document.addEvent('domready', function () {

    CustomMessage.init();
});