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
        _cfTextValue     : '',

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
            $self._cfTextValue = $('CFtext');
            $self._cfSendButton = $('CFsendButton');

            return (
                !$self._cfNameValue
                || !$self._cfEmailValue
                || !$self._cfPhoneValue
                || !$self._cfSubjectValue
                || !$self._cfTextValue
                || !$self._cfSendButton
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
                !DevelopmentHelpers.validateCorrectness($self._cfNameValue, 'text')
                || !DevelopmentHelpers.validateCorrectness($self._cfEmailValue, 'email')
                || !DevelopmentHelpers.validateCorrectness($self._cfPhoneValue, 'phone')
                || !DevelopmentHelpers.validateCorrectness($self._cfSubjectValue, 'text')
                || !DevelopmentHelpers.validateCorrectness($self._cfTextValue, 'text')
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
                !DevelopmentHelpers.validateSecurity($self._cfNameValue)
                || !DevelopmentHelpers.validateSecurity($self._cfEmailValue)
                || !DevelopmentHelpers.validateSecurity($self._cfPhoneValue)
                || !DevelopmentHelpers.validateSecurity($self._cfSubjectValue)
                || !DevelopmentHelpers.validateSecurity($self._cfTextValue)
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
            $self._cfTextValue = $self._cfTextValue.value;

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
                text        : $self._cfTextValue
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
                    }
                },
                onFailure($error){

                    $error = JSON.decode($error);
                    if($error.hasOwnProperty('error')){

                        console.error('ContactsPageController.sendMailToCloudService():' +
                            $error.error);
                        TemplateProcessor.generateCustomErrorMessage('Проблем с изпращането на съобщението.');
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