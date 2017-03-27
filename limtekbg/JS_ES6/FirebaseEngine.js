/**
 * @file FirebaseEngine.js
 *
 * Module, which exposes Firebase functionality.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

const FirebaseEngine = (function(){

	/*
	 * Encapsulate the logic.
	 */

	const Logic = {

        _storage: {},
        _storageRef: {},

        _database: {},
        _databaseRef: {},

        _auth: {},
        _currentUser: null,
        _currentUserFlag: {},
        _loginError: null,
        _loginErrorFlag: {},

        /**
         * Initializes the Firebase engine.
         *
         * @return void
         */

        init: function(){

            const $self = this;

            let $config = {
                databaseURL: "https://limtek-fb748.firebaseio.com",
                storageBucket: "limtek-fb748.appspot.com",
                apiKey: "api_key_goes_here"
            };

            firebase.initializeApp($config);

            // Initialize the storage.
            $self._storage = firebase.storage();
            $self._storageRef = $self._storage.ref();

            // Initialize the real-time database.
            $self._database = firebase.database();
            $self._databaseRef = $self._database.ref();

            // Initialize the Auth object.
            $self._auth = firebase.auth();

            /*
             * For each of the app's pages that need information about the signed-in user,
             * we attach an observer to the global authentication object.
             * This observer gets called whenever the user's sign-in state changes.
             */

            $self._currentUserFlag = new Element('span', {
                styles:{
                    display: 'none'
                }
            });

            $self._loginErrorFlag = new Element('span', {
                styles:{
                    display: 'none'
                }
            });

            $self._auth.onAuthStateChanged(function($currentUser){

                if($currentUser){

                    $self._currentUser = $currentUser;
                    $self._currentUserFlag.fireEvent('present');
                }
                else{

                    $self._currentUser = null;
                    $self._currentUserFlag.fireEvent('not_present');
                }
            });
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
         * Returns the current user flag. Used for catching
         * if the user is logged in.
         *
         * @return {Logic._currentUserFlag|{}}
         */

        getCurrentUserFlag(){

            const $self = this;
            return $self._currentUserFlag;
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

                console.error('FirebaseEngine.login(): You cannot login while, you are logged in!');
                return;
            }

            $self._auth.signInWithEmailAndPassword($email, $password)
                .catch(function($error){

                    if($error){

                        $self._loginError = $error;
                        $self._loginErrorFlag.fireEvent('present');
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
         * Returns the login error flag. Used for catching
         * if there have been any errors while loggin in.
         *
         * @return {Logic._currentUserFlag|{}}
         */

        getLoginErrorFlag(){

            const $self = this;
            return $self._loginErrorFlag;
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
        },

        /**
         * Makes a GET request to the Firebase Real Time database.
         *
         * @important - if data arrived is null, the function returns null
         * as well
         *
         * @param $path - path to retrieve data from
         * @param $extra - extra parameters provided
         * @param $callback - execute after completing the request
         *
         * @return void
         */

        firebaseGET: function($path, $extra, $callback){

            // Represent the extra parameter as a string.
            let $extraString = '';

            for(let $member in $extra){

                if($extra.hasOwnProperty($member)){

                    $extraString += $member + '=' + $extra[$member] + '&';
                }
            }

            // Remove the last & character.
            $extraString = $extraString.substring(0, $extraString.length-1);

            let $request = new Request({
                url: 'https://limtek-fb748.firebaseio.com/' + $path + '.json' + '?' + $extraString,
                method: 'GET',
                onSuccess: function($data){

                    // If the data arrived is null, the function returns null as data as well.

                    // Parse the data to a JSON object.
                    $data = JSON.parse($data);

					/*
					 * If there is 'shallow: true' in the $extra parameter
					 * make sure that the :true after each property is turned
					 * into {}.
					 */

                    if($extra.hasOwnProperty('shallow') && $extra['shallow'] === true){

                        for(let $turnMember in $data){

                            if($data.hasOwnProperty($turnMember)){

                                $data[$turnMember] = {};
                            }
                        }
                    }

                    // Call the callback with the processed data and null for errors.
                    return $callback(null, $data);
                },
                onFailure: function($error){

                    // Log the error.
                    console.error('FirebaseEngine.firebaseGET(): ' + $error);

                    // Call the callback with an error and null for data.
                    return $callback('Data for ' + $path + ' did not arrive because an error!', null);
                }
            });

            // Fire the XHR request.
            $request.send();
        },

        /**
         * Retrieves URL for a specific storage item.
         *
         * @param $path
         * @param $callback
         *
         * @return void
         */

        retrieveStorageItemURL($path, $callback){

            const $self= this;

            let $itemRef = $self._storageRef.child($path);

            $itemRef.getDownloadURL()
                .then(function($URL){

                    // Call the callback with the URL and null for errors.
                    return $callback(null, $URL);
                })
                .catch(function($error){

                    console.error('FirebaseEngine.downloadStorageItem(): ' + $error.code);

                    // Call the callback with the error code and null for URL.
                    return $callback('Data for ' + $path + ' did not arrive because an error!', null);
                });
        }
	};

	return{

		init(){

			Logic.init();
		},

        firebaseGET($path, $extra, $callback){

			Logic.firebaseGET($path, $extra, $callback);
		},

        retrieveStorageItemURL($path, $callback){

        	Logic.retrieveStorageItemURL($path, $callback);
        },

        getCurrentUser(){

            return Logic.getCurrentUser();
        },

        getCurrentUserFlag(){

            return Logic.getCurrentUserFlag();
        },

        getLoginError(){

            return Logic.getLoginError();
        },

        getLoginErrorFlag(){

            return Logic.getLoginErrorFlag();
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

	FirebaseEngine.init();
});