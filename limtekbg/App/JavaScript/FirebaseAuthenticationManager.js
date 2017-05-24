/**
 * @file FirebaseAuthenticationManager.js
 *
 * Exposes Firebase authentication management functionality.
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
        _authError: null,

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
                apiKey: "AIzaSyDV0mt85i0AFHU06uW-VmEwr20ebKPBd14"
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
         * If any errors occur, they get saved in the _authError
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

                $self._authError = 'Не можеш да се впишеш, когато вече си вписан';
                $self._authObserverManager.updateObservers('ERROR 1');
                return;
            }

            $self._auth.signInWithEmailAndPassword($email, $password)
                .catch(function($error){

                    $self._authError = 'Проблем при вписване';

                    if($error && $error.code){

                        if($error.code === 'auth/wrong-password'){

                            $self._authError = 'Неправилна парола';
                        }
                        else if($error.code === 'auth/user-not-found'){

                            $self._authError = 'Неправилен имейл адрес';
                        }

                        console.error('FirebaseAuthenticationManager.login(): ');
                        console.error($error);
                    }

                    $self._authObserverManager.updateObservers('ERROR 1');
                });
        },

        /**
         * Returns the auth error, if any.
         * If there is no auth error, returns null.
         *
         * @return {null}
         */

        getAuthError(){

            const $self = this;
            return $self._authError;
        },

        /**
         * Log-out a user.
         *
         * @return void
         */

        logout(){

            const $self = this;

            $self._auth.signOut()
                .catch(function($error){
                    if($error){

                        $self._authError = 'Възникна проблем';

                        if($error && $error.code){

                            console.error('FirebaseAuthenticationManager.logout(): ');
                            console.log($error);
                        }

                        $self._authObserverManager.updateObservers('ERROR 1');
                    }
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

        getAuthError(){

            return Logic.getAuthError();
        },

        login($email, $password){

            Logic.login($email, $password);
        },

        logout(){

            Logic.logout();
        }
    }
})();

document.addEvent('domready', function(){

    FirebaseAuthenticationManager.init();
});