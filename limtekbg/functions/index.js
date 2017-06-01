'use strict';

/**
 * @file index.js
 *
 * Contains Firebase cloud functions.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

// Node modules
const functions  = require('firebase-functions');
const admin = require('firebase-admin');

// Functions
const UserActions = require('./UserActions');

// Make sure the functions can use admin privileges.
admin.initializeApp(functions.config().firebase);

exports.sendMail = functions.https.onRequest((req, res) => {

    return UserActions.sendMail(req, res);
});