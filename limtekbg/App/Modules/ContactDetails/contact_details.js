/**
 * @file contact_details.js
 *
 * ContactDetails module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const ContactDetails = (function(){

    const Logic = {

        _templatePath: './Modules/ContactDetails/contact_details.html',
        _placeholderName: 'ContactDetailsPlaceholder',
        _template: null,

        /**
         * Makes sure the module is displayed.
         *
         * @return void
         */

        init(){

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

    ContactDetails.init();
});