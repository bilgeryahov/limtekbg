/**
 * @file FirebaseDatabaseAndStorageManager.js
 *
 * Exposes Firebase database and storage management functionality.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const FirebaseDatabaseAndStorageManager = (function(){

    /*
     * Encapsulate the logic.
     */

    const Logic = {

        /**
         * Initialize.
         *
         * @return void
         */

        init: function(){

            if(!FirebaseAuthenticationManager){

                console.error('FirebaseDatabaseAndStorageManager.init(): ' +
                    'FirebaseAuthenticationManager is missing!');

                return;
            }

            if(!EnvironmentHelper){

                console.error('FirebaseDatabaseAndStorageManager.init(): ' +
                    'EnvironmentHelper is missing!');

                return;
            }
        },

        /**
         * Makes a GET request to the Firebase Real Time database.
         *
         * @param $path
         * @param $extra
         * @param $callback
         *
         * @return void
         */

        firebaseGET: function($path, $extra, $callback){

            let $extraString = '';

            for(let $member in $extra){

                if($extra.hasOwnProperty($member)){

                    $extraString += $member + '=' + $extra[$member] + '&';
                }
            }

            // Remove the last & character.
            $extraString = $extraString.substring(0, $extraString.length-1);

            new Request({
                url: EnvironmentHelper.getFirebaseSettings().databaseURL + $path + '.json' + '?' + $extraString,
                method: 'GET',
                onSuccess: function($data){

                    $data = JSON.parse($data);

                    if($data === null){

                        $data = {};
                    }

                    if($extra.hasOwnProperty('shallow') && $extra['shallow'] === true){

                        for(let $turnMember in $data){

                            if($data.hasOwnProperty($turnMember)){

                                $data[$turnMember] = {};
                            }
                        }
                    }

                    return $callback(null, $data);
                },
                onFailure: function($xhr){

                    console.error('FirebaseDatabaseAndStorageManager.firebaseGET(): ');
                    console.error($xhr);
                    return $callback('Data for ' + $path + ' did not arrive because an error!', null);
                }
            }).send();
        },

        /**
         * Makes a PUT request to the Firebase Real Time database.
         *
         * @param $path
         * @param $data
         * @param $callback
         *
         * @return void
         */

       firebasePUT($path, $data, $callback){

            const $putData = JSON.stringify($data);
            let $apiKey = EnvironmentHelper.getFirebaseSettings().apiKey;
            let $token = sessionStorage.getItem('LimtekToken-' + $apiKey);

            const $request = new Request({
                url: EnvironmentHelper.getFirebaseSettings().databaseURL + $path + '.json?auth=' + $token,
                method: 'PUT',
                data: $putData,
                headers:{
                    'Content-Type':'application/json; charset=UTF-8'
                },
                emulation: false,
                urlEncoded: false,
                onSuccess: function($data){

                    return $callback(null, $data);
                },
                onFailure: function($xhr){

                    let $response = JSON.decode($xhr.response);

                    // Check if it says that the token has expired.
                    if($response.hasOwnProperty('error') && $response.error === 'Auth token is expired'){

                        // Get token.
                        FirebaseAuthenticationManager.getUserToken(function ($error, $tokenPresent) {

                            if($error){

                                console.error('FirebaseDatabaseAndStorageManager.firebasePUT(): ' + $error);
                                return $callback('Problem while trying to get token.', null);
                            }

                            $apiKey = EnvironmentHelper.getFirebaseSettings().apiKey;
                            $token = sessionStorage.getItem('LimtekToken-' + $apiKey);
                            $request.options.url = EnvironmentHelper.getFirebaseSettings().databaseURL + $path + '.json?auth=' + $token;
                            $request.send();
                        });

                        return;
                    }

                    console.error('FirebaseDatabaseAndStorageManager.firebasePUT(): ' + $xhr.response);
                    return $callback('PUT request for ' + $path + ' had an error!', null);
                }
            });

            if(!$token || $token === '' || typeof $token === 'undefined'){

                // Get token.
                FirebaseAuthenticationManager.getUserToken(function ($error, $tokenPresent) {

                    if($error){

                        console.error('FirebaseDatabaseAndStorageManager.firebasePUT(): ' + $error);
                        return $callback('Problem while trying to get token.', null);
                    }

                    $apiKey = EnvironmentHelper.getFirebaseSettings().apiKey;
                    $token = sessionStorage.getItem('LimtekToken-' + $apiKey);
                    $request.options.url = EnvironmentHelper.getFirebaseSettings().databaseURL + $path + '.json?auth=' + $token;
                    $request.send();
                });

                return;
            }

            // There is a token.
            $request.send();
       },

        /**
         * Makes a POST request to the Firebase Real Time database.
         *
         * @param $path
         * @param $data
         * @param $callback
         *
         * @return void
         */

        firebasePOST($path, $data, $callback){

            const $postData = JSON.stringify($data);
            let $apiKey = EnvironmentHelper.getFirebaseSettings().apiKey;
            let $token = sessionStorage.getItem('LimtekToken-' + $apiKey);

            const $request = new Request({
                url: EnvironmentHelper.getFirebaseSettings().databaseURL + $path + '.json?auth=' + $token,
                method: 'POST',
                data: $postData,
                headers:{
                    'Content-Type':'application/json; charset=UTF-8'
                },
                emulation: false,
                urlEncoded: false,
                onSuccess: function($data){

                    return $callback(null, $data);
                },
                onFailure: function($xhr){

                    let $response = JSON.decode($xhr.response);

                    // Check if it says that the token has expired.
                    if($response.hasOwnProperty('error') && $response.error === 'Auth token is expired'){

                        // Get token.
                        FirebaseAuthenticationManager.getUserToken(function ($error, $tokenPresent) {

                            if($error){

                                console.error('FirebaseDatabaseAndStorageManager.firebasePOST(): ' + $error);
                                return $callback('Problem while trying to get token.', null);
                            }

                            $apiKey = EnvironmentHelper.getFirebaseSettings().apiKey;
                            $token = sessionStorage.getItem('LimtekToken-' + $apiKey);
                            $request.options.url = EnvironmentHelper.getFirebaseSettings().databaseURL + $path + '.json?auth=' + $token;
                            $request.send();
                        });

                        return;
                    }

                    console.error('FirebaseDatabaseAndStorageManager.firebasePOST(): ' + $xhr.response);
                    return $callback('POST request for ' + $path + ' had an error!', null);
                }
            });

            if(!$token || $token === '' || typeof $token === 'undefined'){

                // Get token.
                FirebaseAuthenticationManager.getUserToken(function ($error, $tokenPresent) {

                    if($error){

                        console.error('FirebaseDatabaseAndStorageManager.firebasePOST(): ' + $error);
                        return $callback('Problem while trying to get token.', null);
                    }

                    $apiKey = EnvironmentHelper.getFirebaseSettings().apiKey;
                    $token = sessionStorage.getItem('LimtekToken-' + $apiKey);
                    $request.options.url = EnvironmentHelper.getFirebaseSettings().databaseURL + $path + '.json?auth=' + $token;
                    $request.send();
                });

                return;
            }

            // There is a token.
            $request.send();
        },

        /**
         * Using the Firebase API, performs a multi-location (bulk) update.
         *
         * The $locationUpdatePairs parameter should be an object with the following structure:
         *
         * {
         *      "/products/categories_details/abv123" : "null",
         *      "/products/categories_details/rty456" : { "display_name" : "Tractors", "parent_id" : null }
         * }
         *
         * So, simply the object should contain all the paths of the objects to be modified - as keys
         * and the data that we want to modify - as values.
         *
         * @param $locationUpdatePairs
         * @param $callback
         *
         * @return void
         */

        firebasePerformMultiLocationUpdate($locationUpdatePairs, $callback){

           firebase
               .database()
               .ref()
               .update($locationUpdatePairs)
               .then(function ($data) {

                   return $callback($data);
               })
               .catch(function ($error) {

                   return $callback($error);
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

        firebasePUT($path, $data, $callback){

            Logic.firebasePUT($path, $data, $callback);
        },

        firebasePOST($path, $data, $callback){

            Logic.firebasePOST($path, $data, $callback);
        },

        firebasePerformMultiLocationUpdate($locationUpdatePairs, $callback){

            Logic.firebasePerformMultiLocationUpdate($locationUpdatePairs, $callback);
        }
    }
})();

document.addEvent('domready', function(){

    FirebaseDatabaseAndStorageManager.init();
});