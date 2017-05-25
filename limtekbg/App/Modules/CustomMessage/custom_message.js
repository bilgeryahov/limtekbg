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
        _template: null,

        /**
         * Initialize the main functionality.
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

            $self._template.prepare();
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
            $self._template.displayAfter( { message : $message } );

            // Since this is also hidden, display it.
            $self._template.makeVisible();
        },

        /**
         * Hides the message box.
         *
         * @return void
         */

        hideMessage(){

            const $self = this;
            $self._template.makeInvisible();
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