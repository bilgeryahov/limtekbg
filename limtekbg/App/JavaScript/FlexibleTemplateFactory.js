/**
 * More specific template factory, focused on flexible data and positioning.
 */

class FlexibleTemplateFactory extends TemplateFactory{

    /**
     * Makes sure that the placeholder and the template are fetched only
     * if they are not present;
     *
     * @return void
     */

    initProcess(){

        let $continueProcess = true;

        if(typeof this._placeholder === 'undefined' || !this._placeholder){

            $continueProcess = this.getPlaceholder();
        }

        if(!$continueProcess){

            return;
        }

        if(typeof  this._template === 'undefined' || !this._template){

            this.getTemplate();
        }
        else{

            this.generateTemplate();
        }
    }

    /**
     * Adding custom template data, after constructing the object.
     *
     * @param $templateData
     *
     * @return void
     */

    addCustomTemplateData($templateData){

        this._templateData = $templateData;
    }

    /**
     * Hide the placeholder from the DOM.
     *
     * @return void
     */

    hidePlaceholder(){

        this._placeholder.style.display = 'none';
    }

    /**
     * Show the placeholder on the DOM.
     *
     * @return void
     */

    showPlaceholder(){

        this._placeholder.style.display = 'block';
    }
}