'use strict';

const functions  = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendMail = functions.https.onRequest((req, res) => {

    // TODO: This needs to be fixed or?
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST');

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

    const allowedParameters = [
        'from_name',
        'from_email',
        'from_phone',
        'subject',
        'text'
    ];

    if(!allowedMethods.includes(req.method)){
        res
            .status(405)
            .json({
                error:'HTTP Method is not allowed!'
            });
        return;
    }

    if(Object.keys(req.body).length !== allowedParameters.length){
        res
            .status(400)
            .json({
                error:'There is a problem with request parameters.'
            });
        return;
    }

    for(let parameter in req.body){
        if(req.body.hasOwnProperty(parameter)){
            let index = allowedParameters.indexOf(parameter);
            if(index !== -1){
                allowedParameters.splice(index, 1);
            }
        }
    }

    if(allowedParameters.length !== 0){
        res
            .status(400)
            .json({
                error:'There is a problem with request parameters.'
            });
        return;
    }

    /*
     * Until this point we verify that the needed parameters
     * have been passed with the needed request type.
     */

    let mailFromName   = req.body.from_name;
    let mailFromEmail  = req.body.from_email;
    let mailFromPhone  = req.body.from_phone;
    let mailSubject    = req.body.subject;
    let mailText       = req.body.text;

    // TODO: Check the req params for their data types (if they are correct).
    // TODO: Check the req params for securiry issues.

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
            res
                .status(503)
                .json({
                    error:'Problem with sending the e-mail.'
                });
            return;
        }

        res
            .status(201)
            .json({
                message: 'E-mail sent.'
            });
    });
});