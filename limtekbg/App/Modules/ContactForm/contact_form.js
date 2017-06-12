/**
 * @file contact_form.js
 *
 * ContactForm module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const ContactForm = (function(){

    const Logic = {

        _templatePath: './Modules/ContactForm/contact_form.html',
        _placeholderName: 'ContactFormPlaceholder',
        _template: null,

        _cfNameElement        : {},
        _cfEmailElement       : {},
        _cfPhoneElement       : {},
        _cfSubjectElement     : {},
        _cfMessageElement     : {},

        _elementsPresent: false,

        _cfNameValue          : '',
        _cfEmailValue         : '',
        _cfPhoneValue         : '',
        _cfSubjectValue       : '',
        _cfMessageValue       : '',

        _cfSendButton         : {},

        _recaptchaApiLoaded: false,
        _contactFormBox: null,

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            if(!CustomMessage){

                console.error('ContactForm.init(): CustomMessage module is not present!');
                return;
            }

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

            $self._template.displayMain();
        },

        /**
         * Gets the elements from the page if they are not already fetched.
         *
         * @return {boolean}
         */

        getDomElements(){

            const $self = this;

            if($self._elementsPresent){

                return true;
            }

            $self._cfNameElement = $('CFname');
            $self._cfEmailElement = $('CFemail');
            $self._cfPhoneElement = $('CFphone');
            $self._cfSubjectElement = $('CFsubject');
            $self._cfMessageElement = $('CFmessage');
            $self._cfSendButton = $('CFsendButton');

            $self._elementsPresent = (
                $self._cfNameElement !== null
                && $self._cfEmailElement !== null
                && $self._cfPhoneElement !== null
                && $self._cfSubjectElement !== null
                && $self._cfMessageElement !== null
                && $self._cfSendButton !== null
            );

            return $self._elementsPresent;
        },

        /**
         * Validates the input field values for correctness.
         *
         * @return {boolean}
         */

        validateInputCorrectness(){

            const $self = this;

            return (
                DevelopmentHelpers.validateCorrectness($self._cfNameValue, 'name')
                && DevelopmentHelpers.validateCorrectness($self._cfEmailValue, 'email')
                && DevelopmentHelpers.validateCorrectness($self._cfPhoneValue, 'phone')
                && DevelopmentHelpers.validateCorrectness($self._cfSubjectValue, 'subject')
                && DevelopmentHelpers.validateCorrectness($self._cfMessageValue, 'text')
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
            DevelopmentHelpers.setButtonTriggeredState('CFsendButton', true);

            // Try to get reCAPTCHA user's response.
            let $reCAPTCHAresponse = grecaptcha.getResponse();
            if(!$reCAPTCHAresponse || $reCAPTCHAresponse === 'undefined' || $reCAPTCHAresponse === ''){

                // Indicate that the sending process has finished.
                DevelopmentHelpers.setButtonTriggeredState('CFsendButton', false);
                console.error('ContactForm.sendMailToCloudService(): reCAPTCHA skipped!');
                CustomMessage.showMessage('Отбележете, че не сте робот.');
                return;
            }

            // First get the DOM elements, at least try.
            if(!$self.getDomElements()){

                // Reset reCAPTCHA
                grecaptcha.reset();

                // Indicate that the sending process has finished.
                DevelopmentHelpers.setButtonTriggeredState('CFsendButton', false);
                console.log('ContactForm.sendMailToCloudService(): Problem with presence' +
                    ' of DOM elements!');
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
                DevelopmentHelpers.setButtonTriggeredState('CFsendButton', false);
                console.error('ContactForm.sendMailToCloudService(): One of the input fields contains ' +
                    ' semantically not correct information');
                CustomMessage.showMessage('Въвели сте некоректна информация или символи.');
                return;
            }

            let $postData = {
                recaptcha_response: $reCAPTCHAresponse,
                name   : $self._cfNameValue,
                email  : $self._cfEmailValue,
                phone  : $self._cfPhoneValue,
                subject     : $self._cfSubjectValue,
                text        : $self._cfMessageValue
            };

            new Request({
                url:'https://us-central1-limtek-fb748.cloudfunctions.net/sendMail',
                method: 'POST',
                data: $postData,
                onSuccess($data){

                    // Reset reCAPTCHA
                    grecaptcha.reset();
                    CustomMessage.showMessage('Съобщението е изпратено успешно.');
                    // Indicate that the sending process has finished.
                    DevelopmentHelpers.setButtonTriggeredState('CFsendButton', false);

                    $data = JSON.decode($data);
                    if($data.hasOwnProperty('message')){
                        console.log('ContactForm.sendMailToCloudService(): ' + $data.message);
                    }
                },
                onFailure($xhr){

                    // Reset reCAPTCHA
                    grecaptcha.reset();
                    CustomMessage.showMessage('Проблем с изпращането на съобщението.');
                    // Indicate that the sending process has finished.
                    DevelopmentHelpers.setButtonTriggeredState('CFsendButton', false);

                    if($xhr){
                        console.error($xhr);
                    }
                }
            }).send();
        },

        /**
         * Loads the reCAPTCHA API after the ContactForm module
         * is for sure initialized and displayed.
         *
         * @return void
         */

        loadRecaptchaApi(){

            let $head= document.getElementsByTagName('head')[0];
            let $script= document.createElement('script');
            $script.type= 'text/javascript';
            $script.src= 'https://www.google.com/recaptcha/api.js';
            $head.appendChild($script);
        },

        /**
         * Makes sure that the recaptcha API script
         * gets loaded and the ContactFormBox gets visible.
         *
         * Checks if everything goes fine. If does not
         * displays a message.
         *
         * @return void
         */

        makeContactFormBoxVisible(){

            const $self = this;

            if($self._recaptchaApiLoaded){

                return;
            }

            if(!$self._contactFormBox){

                $self._contactFormBox = $('ContactFormBox');
            }

            if(!$self._contactFormBox){

                console.log('ContactForm.makeContactFormBoxVisible(): ' +
                    'ContactFormBox is not present on the DOM!');
                return;
            }

            $self.loadRecaptchaApi();

            // Check if the script exists.
            if (document.querySelectorAll(`script[src="https://www.google.com/recaptcha/api.js"]`).length > 0) {

                $self._contactFormBox.style.display = 'block';
                $self._recaptchaApiLoaded = true;

                return;
            }

            CustomMessage.showMessage('Имаше проблем при зареждане на формата. Моля опитайте отново.');
            console.error('ContactForm.makeContactFormBoxVisible(): ' +
             ' the reCAPTCHA API script has not been loaded!');
        }
    };

    return{

        init(){

            Logic.init();
        },

        sendMailToCloudService(){

            Logic.sendMailToCloudService();
        },

        makeContactFormBoxVisible(){

            Logic.makeContactFormBoxVisible();
        }
    }
})();

document.addEvent('domready', function () {

    ContactForm.init();
});