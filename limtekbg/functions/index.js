'use strict';

const functions  = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendMail = functions.https.onRequest((req, res) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'limteksender@gmail.com',
            pass: 'limtek_sender'
        }
    });

    let mailOptions = {
        from: '"Test Too" <testtoo@testtoo.com',
        to: 'bayahov1@gmail.com',
        subject:'test',
        text:'I am testing this shit.'
    };

    transporter.sendMail(mailOptions, (err, data) => {

        if(err){

            res
                .status(503)
                .json({
                    message:'Problem with sending the e-mail!'
                });

            return;
        }

        res
            .status(201)
            .json(data);
    });
});