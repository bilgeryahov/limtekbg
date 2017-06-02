'use strict';

// Node modules
const https = require('https');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const configDetails = require('./configFileFirebaseFunctions.json');


/**
 * Exports functions which are menat to expose
 * functionality to users.
 */

module.exports = {

    /**
     * Sends a user mail to the administrator email inbox.
     *
     * @param req
     * @param res
     *
     * @return void
     */

    sendMail(req, res){

        /*
         * Headers for each response.
         */

        res.header('Access-Control-Allow-Origin', configDetails.AccessControl.AllowOrigin);
        res.header('Access-Control-Allow-Headers', configDetails.AccessControl.AllowHeaders);
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
            'name',
            'email',
            'phone',
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

        if(reqParamsProblem.error === ''){
            if(!checkCorrectness(req)){
                reqParamsProblem.error = 'Correctness check did not pass.';
            }
        }

        if(reqParamsProblem.error !== ''){
            res
                .status(400)
                .json(reqParamsProblem);
            return;
        }

        // TODO: Activate recaptcha when it is back.

        // /*
        //  * Deal with reCAPTCHA.
        //  */
        //
        // const recaptchaPOSTdata = querystring.stringify({
        //     'secret': configDetails.reCAPTCHA.secretKey,
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
        //                 (obj['hostname'].includes(configDetails.reCAPTCHA.hostName.live) ||
        //                 (obj['hostname'].includes(configDetails.reCAPTCHA.hostName.local)))
        //             ){
        //                 return finishSending();
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

        const finishSending = function(){

            let mailName        = req.body.name;
            let mailEmail       = req.body.email;
            let mailPhone       = req.body.phone;
            let mailSubject     = req.body.subject;
            let mailText        = req.body.text;

            let transporter = nodemailer.createTransport({
                service: configDetails.mailService.name,
                auth:{
                    user: configDetails.mailService.username,
                    pass: configDetails.mailService.password
                }
            });

            let mailOptions = {
                to             : configDetails.mailService.recipient,
                from           : mailName + ' ' + mailEmail,
                subject        : mailSubject,
                text           : mailText + '\n\nMessage: Email has been sent from this user: ' + mailEmail
                + '\n\nMessage: Phone number of the sender: ' + mailPhone
            };

            transporter.sendMail(mailOptions, (err, data) => {
                if(err){
                    console.error(err);
                    res
                        .status(503)
                        .json({
                            error:'Problem with sending the e-mail.'
                        });
                    return;
                }

                console.log(data);
                res
                    .status(201)
                    .json({
                        message: 'E-mail sent.'
                    });
            });
        };

        return finishSending();
    }
};

function checkCorrectness(req){

    let $type = '';
    let $input = '';
    let $correct = false;

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

                case 'recaptcha_response':
                    $correct = true;
                    break;

                default:
                    $correct = false;
                    break;
            }

            if(!$correct){

                console.error('This could not be verified to be correct:');
                console.error($type);
                console.error($input);
                return false;
            }
        }
    }

    return true;
}