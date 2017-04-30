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

        _cfNameElement        : {},
        _cfEmailElement       : {},
        _cfPhoneElement       : {},
        _cfSubjectElement     : {},
        _cfMessageElement     : {},

        _cfNameValue          : '',
        _cfEmailValue         : '',
        _cfPhoneValue         : '',
        _cfSubjectValue       : '',
        _cfMessageValue       : '',

        _cfSendButton         : {},

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

            $self._cfNameElement = $('CFname');
            $self._cfEmailElement = $('CFemail');
            $self._cfPhoneElement = $('CFphone');
            $self._cfSubjectElement = $('CFsubject');
            $self._cfMessageElement = $('CFmessage');
            $self._cfSendButton = $('CFsendButton');

            return (
                   $self._cfNameElement !== null
                && $self._cfEmailElement !== null
                && $self._cfPhoneElement !== null
                && $self._cfSubjectElement !== null
                && $self._cfMessageElement !== null
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
         * Attempts to send the message to the
         * cloud service sendMail.
         *
         * @return void
         */

        sendMailToCloudService(){

            const $self = this;

            // Indicate that the send button has been triggered.
            $self.sendButtonTriggeredState(true);

            // Try to get reCAPTCHA user's response.
            let $reCAPTCHAresponse = grecaptcha.getResponse();
            if(!$reCAPTCHAresponse || $reCAPTCHAresponse === 'undefined' || $reCAPTCHAresponse === ''){

                // Indicate that the sending process has finished.
                $self.sendButtonTriggeredState(false);
                console.error('ContactsPageController.sendMailToCloudService(): reCAPTCHA skipped!');
                TemplateProcessor.generateCustomMessage('Отбележете, че не сте робот.');
                return;
            }

            $self._cfNameValue = $self._cfNameElement.value;
            $self._cfEmailValue = $self._cfEmailElement.value;
            $self._cfPhoneValue = $self._cfPhoneElement.value;
            $self._cfSubjectValue = $self._cfSubjectElement.value;
            $self._cfMessageValue = $self._cfMessageElement.value;

            if(!$self.validateInputCorrectness()){

                // Reset reCAPTCHA
                grecaptcha.reset();

                // Indicate that the sending process has finished.
                $self.sendButtonTriggeredState(false);
                console.error('ContactsPageController.sendMailToCloudService(): One of the input fields contains ' +
                    ' semantically not correct information');
                TemplateProcessor.generateCustomMessage('Въвели сте некоректна информация или символи.');
                return;
            }

            if(!$self.validateInputSecurity()){

                // Reset reCAPTCHA
                grecaptcha.reset();

                // Indicate that the sending process has finished.
                $self.sendButtonTriggeredState(false);
                console.error('ContactsPageController.sendMailToCloudService(): One of the input fields contains ' +
                    ' not secure information');
                TemplateProcessor.generateCustomMessage('Въвели сте некоректна информация или символи.');
                return;
            }

            let $postData = {
                recaptcha_response: $reCAPTCHAresponse,
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

                        // Reset reCAPTCHA
                        grecaptcha.reset();

                        console.log('ContactsPageController.sendMailToCloudService(): ' + $data.message);
                        TemplateProcessor.generateCustomMessage('Съобщението е изпратено успешно.');
                        // Indicate that the sending process has finished.
                        $self.sendButtonTriggeredState(false);
                        return;
                    }
                },
                onFailure($xhr){

                    // Reset reCAPTCHA
                    grecaptcha.reset();

                    if($xhr){
                        console.error($xhr);
                    }

                    console.error('ContactsPageController.sendMailToCloudService(): Sending the message failed.');
                    TemplateProcessor.generateCustomMessage('Проблем с изпращането на съобщението.');
                    // Indicate that the sending process has finished.
                    $self.sendButtonTriggeredState(false);
                    return;
                }
            }).send();
        },

        /**
         * Indicates that sending the message has been triggered.
         *
         * @param $triggered
         *
         * @return void
         */

        sendButtonTriggeredState($triggered){

            const $self = this;

            if($triggered){

                $self._cfSendButton.innerHTML = 'Моля изчакайте...';
                $self._cfSendButton.disabled = true;
                return;
            }

            $self._cfSendButton.innerHTML = 'Изпрати';
            $self._cfSendButton.disabled = false;
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