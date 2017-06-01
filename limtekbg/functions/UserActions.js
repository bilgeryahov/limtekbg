'use strict';

/**
 * Exports functions which are menat to expose
 * functionality to users.
 */

module.exports = {

    /**
     * Saves a single message from the user to the
     * database.
     *
     * @param req
     * @param res
     *
     * @return void
     */

    saveMessage(req, res){

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
                    error:'HTTP Method is not allowed!'
                });
            return;
        }

        /*
         * Start checking the request parameters.
         */

        const allowedParameters = [
            'recaptcha_response',
            'from_name',
            'from_email',
            'from_phone',
            'subject',
            'text'
        ];

        let reqParamsProblem = {error: ''};

        if(reqParamsProblem.error === ''){
            if(Object.keys(req.body).length !== allowedParameters.length){
                reqParamsProblem.error = 'The number of request parameters is not matching what the function expects.';
            }
        }

        if(reqParamsProblem.error === ''){
            for(let parameter in req.body){
                if(req.body.hasOwnProperty(parameter)){
                    let index = allowedParameters.indexOf(parameter);
                    if(index !== -1){
                        allowedParameters.splice(index, 1);
                    }
                }
            }
            if(allowedParameters.length !== 0){
                reqParamsProblem.error = 'There are missing request parameters.';
            }
        }

        // Make a request for correctness and escaping HTML.
        if(reqParamsProblem.error === ''){
            let reqParamsObj = {};
            for(let parameter in req.body){
                // Make sure not to send recaptcha response to the validation cheker.
                if(req.body.hasOwnProperty(parameter) && parameter !== 'recaptcha_response'){
                    reqParamsObj[parameter] = req.body[parameter];
                }
            }

            const validateInputPOSTdata = querystring.stringify(reqParamsObj);

            const validateInputPOSToptions = {
                hostname: 'us-central1-limtek-fb748.cloudfunctions.net',
                path: '/validateInput',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(validateInputPOSTdata)
                }
            };

            const validateInputPOSTreq = https.request(validateInputPOSToptions, (validateInputPOSTres) => {
                let output = '';
                validateInputPOSTres.setEncoding('utf8');
                validateInputPOSTres.on('data', (chunk) => {
                    output += chunk;
                });

                validateInputPOSTres.on('end', () => {
                    try{
                        let obj = JSON.parse(output);
                        if(obj.hasOwnProperty('error')){
                            reqParamsProblem.error = obj.error;
                        }
                        return ableToContinue(obj);
                    }
                    catch(exc){
                        console.error('Exception: ' + exc);
                        console.error('Output: ' + output);
                        res
                            .status(503)
                            .json({
                                error:'Failed while parsing the validate input response object.'
                            });
                    }
                });
            });

            validateInputPOSTreq.on('error', (e) => {
                console.error(e);
                res
                    .status(503)
                    .json({
                        error:'Validate input request went wrong.'
                    });
            });

            validateInputPOSTreq.write(validateInputPOSTdata);
            validateInputPOSTreq.end();
        }
        else{
            return ableToContinue({});
        }

        const ableToContinue = function (newBody) {
            if(reqParamsProblem.error !== ''){
                res
                    .status(400)
                    .json(reqParamsProblem);
                return;
            }

            return continueReCAPTCHAprocess(newBody)
        };

        const continueReCAPTCHAprocess = function (newBody) {

            /*
             * Deal with reCAPTCHA.
             */

            // const recaptchaPOSTdata = querystring.stringify({
            //     'secret': '6LeNYx8UAAAAAN4l_zsbZN_7lLY10pESj1TAla0_',
            //     'response': req.body.recaptcha_response
            // });
            //
            // const recaptchaPOSToptions = {
            //     hostname: 'www.google.com',
            //     path: '/recaptcha/api/siteverify',
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'Content-Length': Buffer.byteLength(recaptchaPOSTdata)
            //     }
            // };
            //
            // const recaptchaPOSTreq = https.request(recaptchaPOSToptions, (recaptchaPOSTres) => {
            //     let output = '';
            //     recaptchaPOSTres.setEncoding('utf8');
            //     recaptchaPOSTres.on('data', (chunk) => {
            //         output += chunk;
            //     });
            //
            //     recaptchaPOSTres.on('end', () => {
            //         try{
            //             let obj = JSON.parse(output);
            //
            //             if(!obj.hasOwnProperty('success') || !obj.hasOwnProperty('challenge_ts') ||
            //                 !obj.hasOwnProperty('hostname')){
            //                 console.error(obj);
            //                 res
            //                     .status(503)
            //                     .json({
            //                         error:'reCAPTCHA did not reply with proper message. It misses a property.'
            //                     });
            //                 return;
            //             }
            //
            //             // TODO: Remove localhost from the hostname.
            //             if(obj['success'] === true &&
            //                 (obj['hostname'].includes('limtek-fb748.firebaseapp.com') || (obj['hostname'].includes('localhost')))
            //             ){
            //                 return finishSaving(newBody);
            //             }
            //
            //             console.error(obj);
            //             res
            //                 .status(400)
            //                 .json({
            //                     error: 'reCAPTCHA did not pass success and hostname checks.'
            //                 });
            //         }
            //         catch(exc){
            //             console.error('Exception: ' + exc);
            //             console.error('Output: ' + output);
            //             res
            //                 .status(503)
            //                 .json({
            //                     error:'reCAPTCHA did not reply with proper message. Failed while parsing it.'
            //                 });
            //         }
            //     });
            // });
            //
            // recaptchaPOSTreq.on('error', (e) => {
            //     console.error(e);
            //     res
            //         .status(503)
            //         .json({
            //             error:'reCAPTCHA request went wrong.'
            //         });
            // });
            //
            // recaptchaPOSTreq.write(recaptchaPOSTdata);
            // recaptchaPOSTreq.end();

            // TODO: Until recaptcha is back.
            return finishSaving(newBody);
        };

        const finishSaving = function(newBody){

            // TODO: hardcoded database path to be fixed later.
            const databasePath = '/development/messages/';

            let mailFromName   = newBody.from_name;
            let mailFromEmail  = newBody.from_email;
            let mailFromPhone  = newBody.from_phone;
            let mailSubject    = newBody.subject;
            let mailText       = newBody.text;

            const message = {
                'sentOn': firebase.database.ServerValue.TIMESTAMP,
                'seen': false,
                'data':{
                    'name': mailFromName,
                    'email': mailFromEmail,
                    'phone' : mailFromPhone,
                    'subject': mailSubject,
                    'text': mailText
                }
            };

            admin.database().ref(databasePath)
                .push(message)
                .then(function(snapshot){

                    console.log(snapshot.ref);
                    res
                        .status(201)
                        .json({
                            message: 'Message created!'
                        });
                })
                .catch(function(error){

                    console.error(error);
                    res
                        .status(503)
                        .json({
                            error: 'Message creation has failed!'
                        });
                });
        };
    }
};