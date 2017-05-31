'use strict';

/**
 * @file index.js
 *
 * Contains Firebase cloud functions.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const firebase = require('firebase');
const functions  = require('firebase-functions');
const https = require('https');
const http = require('http');
const querystring = require('querystring');
const admin = require('firebase-admin');

// Make sure the functions can use admin privileges.
admin.initializeApp(functions.config().firebase);

/**
 * @cloudFunction saveMessage.js
 *
 * Cloud function, which saves a single message to the Database.
 * Uses admin privileges to save the data.
 */

exports.saveMessage = functions.https.onRequest((req, res) => {

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

    if(reqParamsProblem.error === ''){
        // TODO: Check the req params for their data types (if they are correct).
        if(5 === 6){
            reqParamsProblem.error = 'The request parameters did not pass the correctness check.';
        }
    }

    if(reqParamsProblem.error !== ''){
        res
            .status(400)
            .json(reqParamsProblem);
        return;
    }

    /*
     * Deal with reCAPTCHA.
     */

    const recaptchaPOSTdata = querystring.stringify({
        'secret': '6LeNYx8UAAAAAN4l_zsbZN_7lLY10pESj1TAla0_',
        'response': req.body.recaptcha_response
    });

    const recaptchaPOSToptions = {
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(recaptchaPOSTdata)
        }
    };

    const recaptchaPOSTreq = https.request(recaptchaPOSToptions, (recaptchaPOSTres) => {
        let output = '';
        recaptchaPOSTres.setEncoding('utf8');
        recaptchaPOSTres.on('data', (chunk) => {
            output += chunk;
        });

        recaptchaPOSTres.on('end', () => {
            try{
                let obj = JSON.parse(output);

                if(!obj.hasOwnProperty('success') || !obj.hasOwnProperty('challenge_ts') ||
                    !obj.hasOwnProperty('hostname')){
                    console.error(obj);
                    res
                        .status(503)
                        .json({
                            error:'reCAPTCHA did not reply with proper message. It misses a property.'
                        });
                    return;
                }

                // TODO: Remove localhost from the hostname.
                if(obj['success'] === true &&
                    (obj['hostname'].includes('limtek-fb748.firebaseapp.com') || (obj['hostname'].includes('localhost')))
                ){
                    return finishSaving();
                }

                console.error(obj);
                res
                    .status(400)
                    .json({
                        error: 'reCAPTCHA did not pass success and hostname checks.'
                    });
            }
            catch(exc){
                console.error('Exception: ' + exc);
                console.error('Output: ' + output);
                res
                    .status(503)
                    .json({
                        error:'reCAPTCHA did not reply with proper message. Failed while parsing it.'
                    });
            }
        });
    });

    recaptchaPOSTreq.on('error', (e) => {
        console.error(e);
        res
            .status(503)
            .json({
                error:'reCAPTCHA request went wrong.'
            });
    });

    recaptchaPOSTreq.write(recaptchaPOSTdata);
    recaptchaPOSTreq.end();

    // POST request going to Database to save the message.
    const finishSaving = function(){

        // TODO: hardcoded database path to be fixed later.
        const databasePath = '/development/messages/';

        let mailFromName   = req.body.from_name;
        let mailFromEmail  = req.body.from_email;
        let mailFromPhone  = req.body.from_phone;
        let mailSubject    = req.body.subject;
        let mailText       = req.body.text;

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
});

exports.validateInput = functions.https.onRequest((req, res) => {

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
        'password',
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

                case 'password':
                    let $lower = new RegExp(/[a-z]{1,}/);
                    let $upper = new RegExp(/[A-Z]{1,}/);
                    let $numeric = new RegExp(/[0-9]{1,}/);
                    let $special = new RegExp(/[!@#$&*]{1,}/);
                    $correct = (
                        $lower.test($input) &&
                        $upper.test($input) &&
                        $numeric.test($input) &&
                        $special.test($input) &&
                        !$input.includes(' ') &&
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
        if(member === 'password'){
            continue;
        }
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
});