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

        _template: null,
        _placeholder: null,
        _templatePath: './Modules/CustomMessage/custom_message.html',

        /**
         * Gets the template and placeholder. If goes successful, calls
         * for generating the template.
         *
         * @return void
         */

        showMessage(message){

            if(!Handlebars){

                console.error('CustomMessage.showMessage(): Handlebars is not present!');
                return;
            }

            const selfObj = this;

            if(selfObj._placeholder === null || selfObj._template === null){
                selfObj._template = $('CustomMessageTemplate');
                selfObj._placeholder = $('CustomMessagePlaceholder');
            }

            new Request({
                url: selfObj._templatePath,
                method: 'get',
                onSuccess(data){
                    return selfObj.generateTemplate(data, message);
                }
            }).send();
        },

        /**
         * Generates the template with the custom message in it.
         *
         * @param pageContent
         * @param templateInfo
         */

        generateTemplate(pageContent, templateInfo){
            const selfObj = this;
            const compiled = Handlebars.compile(pageContent);
            selfObj._placeholder.set('html', compiled({message: templateInfo}));
            selfObj._placeholder.style.display = 'block';
        },

        /**
         * Hides the message box.
         *
         * @return void
         */

        hideMessage(){

            const selfObj = this;
            selfObj._placeholder.style.display = 'none';
        }
    };

    return{

        showMessage(message){

            Logic.showMessage(message);
        },

        hideMessage(){

            Logic.hideMessage();
        }
    }

})();