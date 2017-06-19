/**
 * @file EnvironmentHelper.js
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 2.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const EnvironmentHelper = (function () {

    const Logic = {

        _firebaseSettings: 'firebase_settings_go_here',

        getFirebaseSettings(){

            return this._firebaseSettings;
        }
    };

    return{

        getFirebaseSettings(){

            return Logic.getFirebaseSettings();
        }
    }
})();