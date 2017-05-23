/**
 * @file deliveries_page_static_content.js
 *
 * DeliveriesPageStaticContent module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const DeliveriesPageStaticContent = (function(){

    const Logic = {

        _template: null,
        _placeholder: null,
        _templatePath: './Modules/DeliveriesPageStaticContent/deliveries_page_static_content.html',

        /**
         * Gets the template and placeholder. If goes successful, calls
         * for generating the template.
         *
         * @return void
         */

        init(){

            if(!Handlebars){

                console.error('DeliveriesPageStaticContent.init(): Handlebars is not present!');
                return;
            }

            const selfObj = this;

            selfObj._template = $('DeliveriesPageStaticContentTemplate');
            selfObj._placeholder = $('DeliveriesPageStaticContentPlaceholder');

            if(!selfObj._template || !selfObj._placeholder){

                console.error('DeliveriesPageStaticContent.init(): Template Or Placeholder not found!');
                return;
            }

            new Request({
                url: selfObj._templatePath,
                method: 'get',
                onSuccess(data){
                    return selfObj.generateTemplate(data);
                },
                onFailure(){
                    console.error('DeliveriesPageStaticContent.init(): Failed while getting the template! Aborting!');
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

    DeliveriesPageStaticContent.init();
});