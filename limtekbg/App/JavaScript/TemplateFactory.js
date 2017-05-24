/**
 * Simple class to deal with modularization and more specificly with
 * displaying a single module.
 */

class TemplateFactory{

    /**
     * Expects the relative path to the template, based on the place where the controller
     * JavaScript is located;
     * Expects the placeholder name, that this module relates to;
     * Expects the initial template data to be injected on the DOM;
     *
     * @param templatePath
     * @param placeholderName
     * @param templateData
     */

    constructor(templatePath, placeholderName, templateData){

        this._templatePath = templatePath;
        this._placeholderName = placeholderName;
        this._templateData = templateData;
    }

    /**
     * Initializes the process of displaying the template.
     *
     * @return void
     */

    initProcess(){

        // Only if the placeholder is present.
        if(this.getPlaceholder()){

            this.getTemplate();
        }
    }

    /**
     * Tries to get the placeholder from the main (host) page.
     *
     * @return {boolean}
     */

    getPlaceholder(){

        this._placeholder = $(this._placeholderName);
        if(!this._placeholder){

            console.error(`TemplateFactory - ${this._placeholderName} hasn't been found on the DOM.`);
            return false;
        }

        return true;
    }

    /**
     * Ajax request to fetch the template content from the (small) template file.
     *
     * @return void
     */

    getTemplate(){

        const selfRef = this;
        new Request({
            url: this._templatePath,
            method: 'get',
            onSuccess(template){

                selfRef._template = template;
                selfRef.generateTemplate();
            },
            onFailure(xhr){

                console.error(`TemplateFactory - ${selfRef._templatePath} hasn't been fetched.`);
                console.error(xhr);
            }
        }).send();
    }

    /**
     * Tries to generate the template on the (host) page.
     *
     * @return void
     */

    generateTemplate(){

        const compiled = Handlebars.compile(this._template);
        this._placeholder.set('html', compiled(this._templateData));
    }
}