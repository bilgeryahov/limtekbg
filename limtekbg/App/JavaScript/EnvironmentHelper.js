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

            // Verify development environment
            if(this._db_path.includes('development') && window.location.hostname.includes('localhost')){

                return this._db_path;
            }

            // Verify live environment
            // TODO: limtek is hardcoded
            if(this._db_path.includes('live') && window.location.hostname.includes('limtek-fb748')){

                return this._db_path;
            }

            return null;
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