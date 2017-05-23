/**
 * @file head.js
 *
 * Head module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const Head = (function(){

    const Logic = {

        _template: null,
        _placeholder: null,
        _templatePath: './Modules/Head/head.html',

        /**
         * Gets the template and placeholder. If goes successful, calls
         * for generating the template.
         *
         * @return void
         */

        init(){

            if(!Handlebars){

                console.error('Head.init(): Handlebars is not present!');
                return;
            }

            const selfObj = this;

            selfObj._template = $('HeadTemplate');
            selfObj._placeholder = $('HeadPlaceholder');

            if(!selfObj._template || !selfObj._placeholder){

                console.error('Head.init(): Template Or Placeholder not found!');
                return;
            }

            new Request({
                url: selfObj._templatePath,
                method: 'get',
                onSuccess(data){
                    return selfObj.generateTemplate(data);
                },
                onFailure(){
                    console.error('Head.init(): Failed while getting the template! Aborting!');
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

    Head.init();
});