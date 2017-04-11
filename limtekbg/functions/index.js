const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((req, res) => {

    res
        .status(200)
        .json({
            message:'Hello from my first function!'
        });
});

exports.myAge = functions.https.onRequest((req, res) => {

    res
        .status(404)
        .json({
            message:'My age is not found mate!'
        });
});