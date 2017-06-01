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
const firebase = require('firebase');
const functions  = require('firebase-functions');
const admin = require('firebase-admin');

// Functions
const CloudDevelopmentHelpers = require('./CloudDevelopmentHelpers');
const UserActions = require('./UserActions');

// TODO: hardcoded database path to be fixed later.
const saveMessageDBPath = '/development/messages/';

// Make sure the functions can use admin privileges.
admin.initializeApp(functions.config().firebase);

exports.saveMessage = functions.database.ref(saveMessageDBPath + '{messageId}').onWrite(event => {

    return UserActions.saveMessage(event);
});

exports.validateInput = functions.https.onRequest((req, res) => {
    return CloudDevelopmentHelpers.validateInput(req, res);
});