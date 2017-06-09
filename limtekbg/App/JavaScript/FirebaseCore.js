/**
 * @file FirebaseCore.js
 *
 * Initializes Firebase.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const FirebaseCore = (function () {

    const Logic = {

        init(){

            const config = {
                apiKey: EnvironmentHelper.getFirebaseAPIkey(),
                authDomain: "limtek-fb748.firebaseapp.com",
                databaseURL: "https://limtek-fb748.firebaseio.com",
                projectId: "limtek-fb748",
                storageBucket: "limtek-fb748.appspot.com",
                messagingSenderId: "876594439093"
            };

            firebase.initializeApp(config);
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function(){

    FirebaseCore.init();
});