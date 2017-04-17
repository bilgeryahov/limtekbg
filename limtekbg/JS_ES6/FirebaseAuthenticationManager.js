/**
 * @file FirebaseAuthenticationManager.js
 *
 * Module, which exposes Firebase authentication management functionality.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const FirebaseAuthenticationManager = (function(){

    /*
     * Encapsulate the logic.
     */

    const Logic = {

        _auth: {},
        _currentUser: null,
        _loginError: null,

        // Auth ObserverManager of FirebaseAuthenticationManager.
        _authObserverManager: {},

        /**
         * Initializing.
         *
         * @return void
         */

        init: function(){

            const $self = this;

            let $config = {
                apiKey: "api_key_goes_here"
            };

            firebase.initializeApp($config);

            // Initialize the Auth object.
            $self._auth = firebase.auth();

            // Try to set a new Auth ObserverManager.
            try{

                $self._authObserverManager = new ObserverManager();
            }
            catch($error){

                console.error('FirebaseAuthenticationManager.init(): ' + $error);
                return;
            }

            $self._authObserverManager.clearObservers();

            $self._auth.onAuthStateChanged(function($currentUser){

                if($currentUser){

                    $self._currentUser = $currentUser;
                    $self._authObserverManager.updateObservers('USER 1');
                }
                else{

                    $self._currentUser = null;
                    $self._authObserverManager.updateObservers('USER 0');
                }
            });
        },

        /**
         * Gets the Auth ObserverManager of FirebaseAuthenticationManager.
         *
         * @return {Logic._authObserverManager|{}}
         */

        getAuthObserverManager(){

            const $self = this;
            return $self._authObserverManager;
        },

        /**
         * Returns the current user.
         * If no user is logged in, NULL is returned.
         *
         * @return {null}
         */

        getCurrentUser(){

            const $self = this;
            return $self._currentUser;
        },

        /**
         * Logs in a user based on e-mail and password.
         * If any errors occur, they get saved in the _loginError
         * attribute of the object.
         *
         * @param $email
         * @param $password
         *
         * @return void
         */

        login($email, $password){

            const $self = this;

            if($self.getCurrentUser()){

                console.error('FirebaseAuthenticationManager.login(): You cannot login while, you are logged in!');
                return;
            }

            $self._auth.signInWithEmailAndPassword($email, $password)
                .catch(function($error){

                    if($error){

                        $self._loginError = $error.message;
                        $self._authObserverManager.updateObservers('ERROR 1');
                    }
                });
        },

        /**
         * Returns the login error, if any.
         * If there is no login error, returns null.
         *
         * @return {null}
         */

        getLoginError(){

            const $self = this;
            return $self._loginError;
        },

        /**
         * Log-out a user.
         *
         * @param $callback
         *
         * @return void
         */

        logout($callback){

            const $self = this;

            $self._auth.signOut().then(function(){

                // Sign-out was successful.
                return $callback(null, true);
            }).catch(function($error){

                // Sign-out had problems.
                return $callback($error.message, null);
            });
        }
    };

    return{

        init(){

            Logic.init();
        },

        getAuthObserverManager(){

            return Logic.getAuthObserverManager();
        },

        getCurrentUser(){

            return Logic.getCurrentUser();
        },

        getLoginError(){

            return Logic.getLoginError();
        },

        login($email, $password){

            Logic.login($email, $password);
        },

        logout($callback){

            Logic.logout($callback);
        }
    }
})();

document.addEvent('domready', function(){

    FirebaseAuthenticationManager.init();
});
