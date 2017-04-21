/**
 * @file ContactsPageController.js
 *
 * Module which exposes controller functionality to the Contacts page.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const ContactsPageController = (function () {

    /*
     * Encapsulate the logic.
     */

    const Logic = {

        _cfNameValue     : '',
        _cfEmailValue    : '',
        _cfPhoneValue    : '',
        _cfSubjectValue  : '',
        _cfMessageValue     : '',

        _cfSendButton    : {},

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const $self = this;

            if(!TemplateProcessor){

                console.error('ContactsPageController.init(): TemplateProcessor is not present!');
                return;
            }

            if(!$self.getDomElements()){

                console.error('ContactsPageController.init(): One of the DOM lements is missing.');
                return;
            }

            $self._cfSendButton.addEvent('click', function(){

                $self.sendMailToCloudService();
            });
        },

        /**
         * Gets the elements from the page.
         *
         * @return {boolean}
         */

        getDomElements(){

            const $self = this;

            $self._cfNameValue = $('CFname');
            $self._cfEmailValue = $('CFemail');
            $self._cfPhoneValue = $('CFphone');
            $self._cfSubjectValue = $('CFsubject');
            $self._cfMessageValue = $('CFmessage');
            $self._cfSendButton = $('CFsendButton');

            return (
                   $self._cfNameValue !== null
                && $self._cfEmailValue !== null
                && $self._cfPhoneValue !== null
                && $self._cfSubjectValue !== null
                && $self._cfMessageValue !== null
                && $self._cfSendButton !== null
            );
        },

        /**
         * Validates the input field values for correctness.
         *
         * @return {boolean}
         */

        validateInputCorrectness(){

            const $self = this;

            return (
                DevelopmentHelpers.validateCorrectness($self._cfNameValue, 'text')
                && DevelopmentHelpers.validateCorrectness($self._cfEmailValue, 'email')
                && DevelopmentHelpers.validateCorrectness($self._cfPhoneValue, 'phone')
                && DevelopmentHelpers.validateCorrectness($self._cfSubjectValue, 'text')
                && DevelopmentHelpers.validateCorrectness($self._cfMessageValue, 'text')
            );
        },

        /**
         * Validates input fields for security issues.
         *
         * @return {boolean}
         */

        validateInputSecurity(){

            const $self = this;

            return(
                DevelopmentHelpers.validateSecurity($self._cfNameValue)
                && DevelopmentHelpers.validateSecurity($self._cfEmailValue)
                && DevelopmentHelpers.validateSecurity($self._cfPhoneValue)
                && DevelopmentHelpers.validateSecurity($self._cfSubjectValue)
                && DevelopmentHelpers.validateSecurity($self._cfMessageValue)
            );
        },

        /**
         *
         */

        sendMailToCloudService(){

            const $self = this;

            $self._cfNameValue = $self._cfNameValue.value;
            $self._cfEmailValue = $self._cfEmailValue.value;
            $self._cfPhoneValue = $self._cfPhoneValue.value;
            $self._cfSubjectValue = $self._cfSubjectValue.value;
            $self._cfMessageValue = $self._cfMessageValue.value;

            if(!$self.validateInputCorrectness()){

                console.error('ContactsPageController.sendMailToCloudService(): One of the input fields contains ' +
                    ' semantically not correct information');
                TemplateProcessor.generateCustomErrorMessage('Въвели сте некоректна информация или символи.');
                return;
            }

            if(!$self.validateInputSecurity()){

                console.error('ContactsPageController.sendMailToCloudService(): One of the input fields contains ' +
                    ' not secure information');
                TemplateProcessor.generateCustomErrorMessage('Въвели сте некоректна информация или символи.');
                return;
            }

            let $postData = {
                from_name   : $self._cfNameValue,
                from_email  : $self._cfEmailValue,
                from_phone  : $self._cfPhoneValue,
                subject     : $self._cfSubjectValue,
                text        : $self._cfMessageValue
            };

            new Request({
                url:'https://us-central1-limtek-fb748.cloudfunctions.net/sendMail',
                method: 'POST',
                data: $postData,
                onSuccess($data){

                    $data = JSON.decode($data);
                    if($data.hasOwnProperty('message')){

                        console.error('ContactsPageController.sendMailToCloudService(): ' + $data.message);
                        TemplateProcessor.generateCustomErrorMessage('Съобщението е изпратено успешно.');
                        return;
                    }
                },
                onFailure($error){

                    $error = JSON.decode($error);
                    if($error.hasOwnProperty('error')){

                        console.error('ContactsPageController.sendMailToCloudService():' +
                            $error.error);
                        TemplateProcessor.generateCustomErrorMessage('Проблем с изпращането на съобщението.');
                        return;
                    }
                }
            }).send();
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function(){

    ContactsPageController.init();
});