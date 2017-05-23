/**
 * @file footer.js
 *
 * Footer module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const Footer = (function(){

    const Logic = {

        _template: null,
        _placeholder: null,
        _templatePath: './Modules/Footer/footer.html',

        /**
         * Gets the template and placeholder. If goes successful, calls
         * for generating the template.
         *
         * @return void
         */

        init(){

            if(!Handlebars){

                console.error('Footer.init(): Handlebars is not present!');
                return;
            }

            const selfObj = this;

            selfObj._template = $('FooterTemplate');
            selfObj._placeholder = $('FooterPlaceholder');

            if(!selfObj._template || !selfObj._placeholder){

                console.error('Footer.init(): Template Or Placeholder not found!');
                return;
            }

            new Request({
                url: selfObj._templatePath,
                method: 'get',
                onSuccess(data){
                    return selfObj.generateTemplate(data);
                },
                onFailure(){
                    console.error('Footer.init(): Failed while getting the template! Aborting!');
                }
            }).send();
        },

        /**
         * Generates the template using Handlebars.
         *
         * @param data
         *
         * @return void
         */

        generateTemplate(data){
            const selfObj = this;
            const compiled = Handlebars.compile(data);
            selfObj._placeholder.set('html', compiled());
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function () {

    Footer.init();
});