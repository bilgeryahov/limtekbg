/**
 * @file EnvironmentHelper.js
 *
 * Based on the environment provides API keys, Database paths and much more.
 * All those settings get set up while deploying.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const EnvironmentHelper = (function () {

    const Logic = {

        _firebase_api_key: 'firebase_api_key_goes_here',
        _db_path: 'db_path_goes_here',

        getFirebaseAPIkey(){

            return this._firebase_api_key;
        },

        getDBpath(){

            return this._db_path;
        }
    };

    return{

        getFirebaseAPIkey(){

            return Logic.getFirebaseAPIkey();
        },

        getDBpath(){

            return Logic.getDBpath();
        }
    }
})();