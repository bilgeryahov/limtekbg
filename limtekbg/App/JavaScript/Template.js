/**
 * Function - class, used to deal with simple templates,
 * which require no deep logic.
 *
 * @param $templatePath
 * @param $placeholderName
 * @param $templateData
 * @constructor
 */

function Template($templatePath, $placeholderName, $templateData){

    // Initial private details.
    const _templatePath = $templatePath;
    const _placeholderName = $placeholderName;
    const _templateData = $templateData;

    // Will be populated later.
    let _placeholder = {};
    let _template = {};

    // Tries to fetch the placeholder from the host page.
    const getPlaceholder = function () {

        _placeholder = $(_placeholderName);
        if(!_placeholder){

            console.error(`Template: ${_placeholderName} has not been found on DOM.`);
            return false;
        }

        return true;
    };

    // Tries to fetch the template from the module-html file.
    const getTemplate = function () {

        new Request({
            url: _templatePath,
            method: 'get',
            onSuccess($template){

                _template = $template;
                return generateTemplate();
            },
            onFailure($xhr){

                console.error(`Template: ${_templatePath} has not been fetched.`);
                console.error($xhr);
            }
        }).send();
    };

    // Tries to generate the template on the host page with the initially passed data.
    const generateTemplate = function () {

        const $compiled = Handlebars.compile(_template);
        _placeholder.set('html', $compiled(_templateData));
    };

    /**
     * @public
     *
     * Kicks-in the process.
     *
     * @return void
     */

    this.displayMain = function () {

        if(getPlaceholder()){

            getTemplate();
        }
    };
}