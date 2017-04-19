'use strict';

const functions  = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendMail = functions.https.onRequest((req, res) => {
    const allowedMethods = [
        'POST',
        'PUT'
    ];

    const allowedParameters = [
        'from_name',
        'from_email',
        'subject',
        'text'
    ];

    if(!allowedMethods.includes(req.method)){
        res
            .status(405)
            .json({
                message:'HTTP Method is not allowed!'
            });
        return;
    }

    if(Object.keys(req.body).length !== allowedParameters.length){
        res
            .status(400)
            .json({
                message:'There is a problem with request parameters.'
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
                message:'There is a problem with request parameters.'
            });
        return;
    }

    // TODO: Check the req params for securiry issues.

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'limteksender@gmail.com',
            pass: 'limtek_sender'
        }
    });

    let mailFromName   = req.body.from_name;
    let mailFromEmail  = req.body.from_email;
    let mailSubject    = req.body.subject;
    let mailText       = req.body.text;

    let mailOptions = {
        to             : 'bayahov1@gmail.com',
        from           : mailFromName + ' ' + mailFromEmail,
        subject        : mailSubject,
        text           : mailText + '\n\nMessage: Email has been sent from this user: ' + mailFromEmail
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            res
                .status(503)
                .json({
                    message:'Problem with sending the e-mail.'
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