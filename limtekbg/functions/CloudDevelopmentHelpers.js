'use strict';
/**
 * Exports functions, which are meant to be used as
 * development helpers in the cloud.
 *
 * @type {{validateInput: ((req, res))}}
 * Validates user input for correctness and makes
 * sure that dangerous characters are HTML escaped.
 */

module.exports = {

    validateInput(req, res){

        /*
         * Headers for each response.
         */

        // TODO: Access-Control-Allow-Origin to be changed only to live website.
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS');

        /*
         * Deal with req method type.
         */

        const allowedMethods = [
            'POST',
            'PUT',
            'OPTIONS'
        ];

        if(req.method === 'OPTIONS'){
            res.
            status(200)
                .json();
            return;
        }

        if(!allowedMethods.includes(req.method)){
            res
                .status(405)
                .json({
                    error:'HTTP Method is not allowed'
                });
            return;
        }

        /*
         * Start checking the request parameters.
         *
         * The last parameter is to make sure that
         * the request is coming from a trusted origin.
         */

        // TODO: To add more, when more input from the user gets implemented.
        const allowedParameters = [
            'email',
            'name',
            'phone',
            'subject',
            'text',

            'verify_origin'
        ];

        let reqParamsProblem = {error: ''};

        if(reqParamsProblem.error === ''){
            // Make sure that parameters more than allowed can not be provided.
            if(Object.keys(req.body).length > allowedParameters.length){
                reqParamsProblem.error = 'The number of request parameters is more than what the function can process';
            }
        }

        if(reqParamsProblem.error === ''){
            // Make sure there are not parameters that cannot be processed.
            for(let parameter in req.body){
                if(req.body.hasOwnProperty(parameter)){
                    let index = allowedParameters.indexOf(parameter);
                    if(index === -1){
                        reqParamsProblem.error = 'Parameter cannot be processed';
                        break;
                    }
                }
            }
        }

        // Early check.
        if(reqParamsProblem.error === ''){
            // Make sure that the request is coming from a trusted origin.
            if(!req.body.verify_origin || req.body.verify_origin !== 'no_more_sadness_in_the_world'){
                reqParamsProblem.error = 'Not a trusted origin';
            }
        }

        if(reqParamsProblem.error !== ''){
            res
                .status(400)
                .json(reqParamsProblem);
            return;
        }

        // First make sure that the parameters are semantically matching their type.
        let $correct = false;
        let $type  = '';
        let $input = '';

        for(let parameter in req.body){
            if(req.body.hasOwnProperty(parameter)){
                $type = parameter.toString();
                $input = req.body[parameter].toString();

                // Just copy and paste from DevelopmentHelpers.validateCorrectness.
                switch ($type){

                    case 'email':
                        let $atPos = $input.indexOf('@');
                        let $dotPos = $input.indexOf('.');
                        $correct = (
                            $input.length < 50 &&
                            $atPos > 0 &&
                            $dotPos > $atPos +2 &&
                            $dotPos + 2 < $input.length &&
                            !$input.includes(' ')
                        );
                        break;

                    case 'phone':
                        $correct = (
                            !isNaN($input) &&
                            $input.length < 50
                        );
                        break;

                    case 'name':
                        $correct = (
                            $input.length < 50
                        );
                        break;

                    case 'subject':
                        $correct = (
                            $input.length < 50
                        );
                        break;

                    case 'text':
                        $correct = (
                            $input.length < 600
                        );
                        break;

                    case 'verify_origin':
                        $correct = (
                            $input === 'no_more_sadness_in_the_world'
                        );
                        break;

                    default:
                        $correct = false;
                        break;
                }

                if(!$correct){
                    res
                        .status(400)
                        .json({
                            error: 'Problem while verifying the input'
                        });
                    return;
                }
            }
        }

        // Let's create an object, in which we replace the parameters.
        let newObject = {};
        for(let parameter in req.body) {
            if (req.body.hasOwnProperty(parameter)) {
                newObject[parameter] = req.body[parameter];
            }
        }

        // Time for HTML Escape.
        for(let member in newObject) {
            if (newObject.hasOwnProperty(member)) {
                newObject[member] = newObject[member].replace(/&/g, '&amp;');
                newObject[member] = newObject[member].replace(/</g, '&lt;');
                newObject[member] = newObject[member].replace(/>/g, '&gt;');
                newObject[member] = newObject[member].replace(/"/g, '&amp;');
                newObject[member] = newObject[member].replace(/'/g, '&#x27;');
                newObject[member] = newObject[member].replace(/\//g, '&#x2F;');
            }
        }

        // Considered to be done.
        res
            .status(200)
            .json(newObject);
    }
};