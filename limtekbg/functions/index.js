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

/**
 * @cloudFunction saveMessage.js
 *
 * Cloud function, which saves a single message to the Database.
 */

exports.saveMessage = functions.https.onRequest((req, res) => {

    /*
     * Headers for each response.
     */

    // TODO: Access-Control-Allow-Origin to be changed only to live website.
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST');

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

    if(reqParamsProblem.error === ''){
        // TODO: Check the req params for securiry issues.
        if(5 === 6){
            reqParamsProblem.error = 'The request parameters did not pass the security check.';
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
        const databasePath = '/development/messages/.json';

        let mailFromName   = req.body.from_name;
        let mailFromEmail  = req.body.from_email;
        let mailFromPhone  = req.body.from_phone;
        let mailSubject    = req.body.subject;
        let mailText       = req.body.text;

        /*
         * The last property is to make sure that only this function can write
         * to the messages.
         * Since writing is allowed on that datapoint, we want to make sure
         * that the datapoint cannot be spammed with redundant data.
         */

        const messageData = JSON.stringify({
            'dateSent': firebase.database.ServerValue.TIMESTAMP,
            'seen': false,
            'messageData': {
                'name': mailFromName,
                'email':mailFromEmail,
                'phone': mailFromPhone,
                'subject': mailSubject,
                'text': mailText
            },
            'secret_by_bilger_yahov' : 'no_more_sadness_in_this_world'
        });

        const messagePOSToptions = {
            hostname: 'limtek-fb748.firebaseio.com',
            path: databasePath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(messageData)
            }
        };

        const messagePOSTreq = https.request(messagePOSToptions, (messagePOSTres) => {

            let output = '';
            messagePOSTres.setEncoding('utf8');
            messagePOSTres.on('data', (chunk) => {
                output += chunk;
            });

            messagePOSTres.on('end', () => {
                try{
                    let obj = JSON.parse(output);
                    if(obj.hasOwnProperty('error')){
                        console.error(obj);
                        res
                            .status(503)
                            .json({
                                error:'Database throws an error!'
                            });
                        return;
                    }

                    res
                        .status(201)
                        .json({
                            message:'Message created!'
                        });
                }
                catch(exc){
                    console.error('Exception: ' + exc);
                    console.error('Output: ' + output);
                    res
                        .status(503)
                        .json({
                            error:'Error while parsing the response from the message saving!'
                        });
                }
            });
        });

        messagePOSTreq.on('error', (e) => {
            console.error(e);
            res
                .status(503)
                .json({
                    error:'Message saving POST request went wrong.'
                });
        });

        messagePOSTreq.write(messageData);
        messagePOSTreq.end();
    };
});