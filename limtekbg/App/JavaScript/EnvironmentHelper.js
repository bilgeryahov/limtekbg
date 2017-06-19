/**
 * @file EnvironmentHelper.js
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 2.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const EnvironmentHelper = (function () {

    const Logic = {

        _apiKey: 'apiKey_goes_here',
        _authDomain: 'authDomain_goes_here',
        _databaseURL: 'databaseURL_goes_here',
        _projectId: 'projectId_goes_here',
        _storageBucket: 'storageBucket_goes_here',
        _messagingSenderId: 'messagingSenderId_goes_here',

        getApiKey(){

            return this._apiKey;
        },

        getAuthDomain(){

            return this._authDomain;
        },

        getDatabaseURL(){

            return this._databaseURL;
        },

        getProjectId(){

            return this._projectId;
        },

        getStorageBucket(){

            return this._storageBucket;
        },

        getMessagingSenderId(){

            return this._messagingSenderId;
        }
    };

    return{

        getApiKey(){

            return Logic.getApiKey();
        },

        getAuthDomain(){

            return Logic.getAuthDomain();
        },

        getDatabaseURL(){

            return Logic.getDatabaseURL();
        },

        getProjectId(){

            return Logic.getProjectId();
        },

        getStorageBucket(){

            return Logic.getStorageBucket();
        },

        getMessagingSenderId(){

            return Logic.getMessagingSenderId();
        }
    }
})();