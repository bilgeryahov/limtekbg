'use strict';

/**
 * @file index.js
 *
 * Contains Firebase cloud functions.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const functions  = require('firebase-functions');
const nodemailer = require('nodemailer');
const querystring = require('querystring');
const https = require('https');
const http = require('http');

/**
 * @cloudFunction sendMail.js
 *
 * Cloud function which deals with sending an email message to Gmail account.
 */

exports.sendMail = functions.https.onRequest((req, res) => {

    /*
     * Headers for each response.
     */

    res.header('Access-Control-Allow-Origin', 'https://limtek-fb748.firebaseapp.com');
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

                if(obj['success'] === true && obj['hostname'].includes('limtek-fb748.firebaseapp.com')){
                    return finishSendingMail();
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

    const finishSendingMail = function(){
        let mailFromName   = req.body.from_name;
        let mailFromEmail  = req.body.from_email;
        let mailFromPhone  = req.body.from_phone;
        let mailSubject    = req.body.subject;
        let mailText       = req.body.text;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: 'limteksender@gmail.com',
                pass: 'limtek_sender'
            }
        });

        let mailOptions = {
            to             : 'bayahov1@gmail.com',
            from           : mailFromName + ' ' + mailFromEmail,
            subject        : mailSubject,
            text           : mailText + '\n\nMessage: Email has been sent from this user: ' + mailFromEmail
            + '\n\nMessage: Phone number of the sender: ' + mailFromPhone
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
    }
});