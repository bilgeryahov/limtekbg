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
        _templateFactory: null,

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
         * Makes sure the module is displayed.
         *
         * @return void
         */

        init(){

            if(!CustomMessage){

                console.error('ContactForm.init(): CustomMessage module is not present!');
                return;
            }

            const selfObj = this;

            selfObj._templateFactory = new TemplateFactory(
                selfObj._templatePath, selfObj._placeholderName, {}
            );

            selfObj._templateFactory.initProcess();
        },

        /**
         * Gets the elements from the page.
         *
         * @return {boolean}
         */

        getDomElements(){

            const selfObj = this;

            selfObj._cfNameElement = $('CFname');
            selfObj._cfEmailElement = $('CFemail');
            selfObj._cfPhoneElement = $('CFphone');
            selfObj._cfSubjectElement = $('CFsubject');
            selfObj._cfMessageElement = $('CFmessage');
            selfObj._cfSendButton = $('CFsendButton');

            return (
                selfObj._cfNameElement !== null
                && selfObj._cfEmailElement !== null
                && selfObj._cfPhoneElement !== null
                && selfObj._cfSubjectElement !== null
                && selfObj._cfMessageElement !== null
                && selfObj._cfSendButton !== null
            );
        },

        /**
         * Validates the input field values for correctness.
         *
         * @return {boolean}
         */

        validateInputCorrectness(){

            const selfObj = this;

            return (
                DevelopmentHelpers.validateCorrectness(selfObj._cfNameValue, 'name')
                && DevelopmentHelpers.validateCorrectness(selfObj._cfEmailValue, 'email')
                && DevelopmentHelpers.validateCorrectness(selfObj._cfPhoneValue, 'phone')
                && DevelopmentHelpers.validateCorrectness(selfObj._cfSubjectValue, 'subject')
                && DevelopmentHelpers.validateCorrectness(selfObj._cfMessageValue, 'text')
            );
        },

        /**
         * Validates input fields for security issues.
         *
         * @return {boolean}
         */

        validateInputSecurity(){

            const selfObj = this;

            return(
                DevelopmentHelpers.validateSecurity(selfObj._cfNameValue)
                && DevelopmentHelpers.validateSecurity(selfObj._cfEmailValue)
                && DevelopmentHelpers.validateSecurity(selfObj._cfPhoneValue)
                && DevelopmentHelpers.validateSecurity(selfObj._cfSubjectValue)
                && DevelopmentHelpers.validateSecurity(selfObj._cfMessageValue)
            );
        },

        /**
         * Attempts to send the message to the
         * cloud service sendMail.
         *
         * @return void
         */

        sendMailToCloudService(){

            const selfObj = this;

            // Indicate that the send button has been triggered.
            selfObj.sendButtonTriggeredState(true);

            // Try to get reCAPTCHA user's response.
            let reCAPTCHAresponse = grecaptcha.getResponse();
            if(!reCAPTCHAresponse || reCAPTCHAresponse === 'undefined' || reCAPTCHAresponse === ''){

                // Indicate that the sending process has finished.
                selfObj.sendButtonTriggeredState(false);
                console.error('ContactForm.sendMailToCloudService(): reCAPTCHA skipped!');
                CustomMessage.showMessage('Отбележете, че не сте робот.');
                return;
            }

            selfObj._cfNameValue = selfObj._cfNameElement.value;
            selfObj._cfEmailValue = selfObj._cfEmailElement.value;
            selfObj._cfPhoneValue = selfObj._cfPhoneElement.value;
            selfObj._cfSubjectValue = selfObj._cfSubjectElement.value;
            selfObj._cfMessageValue = selfObj._cfMessageElement.value;

            if(!selfObj.validateInputCorrectness()){

                // Reset reCAPTCHA
                grecaptcha.reset();

                // Indicate that the sending process has finished.
                selfObj.sendButtonTriggeredState(false);
                console.error('ContactForm.sendMailToCloudService(): One of the input fields contains ' +
                    ' semantically not correct information');
                CustomMessage.showMessage('Въвели сте некоректна информация или символи.');
                return;
            }

            if(!selfObj.validateInputSecurity()){

                // Reset reCAPTCHA
                grecaptcha.reset();

                // Indicate that the sending process has finished.
                selfObj.sendButtonTriggeredState(false);
                console.error('ContactForm.sendMailToCloudService(): One of the input fields contains ' +
                    ' not secure information');
                CustomMessage.showMessage('Въвели сте некоректна информация или символи.');
                return;
            }

            let postData = {
                recaptcha_response: reCAPTCHAresponse,
                from_name   : selfObj._cfNameValue,
                from_email  : selfObj._cfEmailValue,
                from_phone  : selfObj._cfPhoneValue,
                subject     : selfObj._cfSubjectValue,
                text        : selfObj._cfMessageValue
            };

            new Request({
                url:'https://us-central1-limtek-fb748.cloudfunctions.net/sendMail',
                method: 'POST',
                data: postData,
                onSuccess(data){

                    data = JSON.decode(data);
                    if(data.hasOwnProperty('message')){

                        // Reset reCAPTCHA
                        grecaptcha.reset();

                        console.log('ContactForm.sendMailToCloudService(): ' + data.message);
                        CustomMessage.showMessage('Съобщението е изпратено успешно.');
                        // Indicate that the sending process has finished.
                        selfObj.sendButtonTriggeredState(false);
                    }
                },
                onFailure(xhr){

                    // Reset reCAPTCHA
                    grecaptcha.reset();

                    if(xhr){
                        console.error(xhr);
                    }

                    console.error('ContactForm.sendMailToCloudService(): Sending the message failed.');
                    CustomMessage.showMessage('Проблем с изпращането на съобщението.');
                    // Indicate that the sending process has finished.
                    selfObj.sendButtonTriggeredState(false);
                }
            }).send();
        },

        /**
         * Indicates that sending the message has been triggered.
         *
         * @param isTriggered
         *
         * @return void
         */

        sendButtonTriggeredState(isTriggered){

            const selfObj = this;

            if(isTriggered){

                selfObj._cfSendButton.innerHTML = 'Моля изчакайте...';
                selfObj._cfSendButton.disabled = true;
                return;
            }

            selfObj._cfSendButton.innerHTML = 'Изпрати';
            selfObj._cfSendButton.disabled = false;
        }
    };

    return{

        init(){

            Logic.init();
        },

        sendMailToCloudService(){

            Logic.sendMailToCloudService();
        }
    }

})();

document.addEvent('domready', function () {

    ContactForm.init();
});