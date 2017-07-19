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

// Functions
const UserActions = require('./UserActions');

exports.sendMail = functions.https.onRequest((req, res) => {

    return UserActions.sendMail(req, res);
});