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
const https = require('https');
const http = require('http');
const querystring = require('querystring');
const admin = require('firebase-admin');

// Functions
const CloudDevelopmentHelpers = require('./CloudDevelopmentHelpers');
const UserActions = require('./UserActions');

// Make sure the functions can use admin privileges.
admin.initializeApp(functions.config().firebase);

exports.saveMessage = functions.https.onRequest((req, res) => {
    return UserActions.saveMessage(req, res);
});

exports.validateInput = functions.https.onRequest((req, res) => {
    return CloudDevelopmentHelpers.validateInput(req, res);
});