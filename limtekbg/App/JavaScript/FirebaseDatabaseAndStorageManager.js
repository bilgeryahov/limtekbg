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
                url: 'https://limtek-fb748.firebaseio.com/' + $path + '.json' + '?' + $extraString,
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
            let $token = sessionStorage.getItem('LimtekCurrentUserToken');

            const $request = new Request({
                url: 'https://limtek-fb748.firebaseio.com/' + $path + '.json?auth=' + $token,
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

                            $token = sessionStorage.getItem('LimtekCurrentUserToken');
                            $request.options.url = 'https://limtek-fb748.firebaseio.com/' + $path + '.json?auth=' + $token;
                            return $request.send();
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

                    $token = sessionStorage.getItem('LimtekCurrentUserToken');
                    $request.options.url = 'https://limtek-fb748.firebaseio.com/' + $path + '.json?auth=' + $token;
                    return $request.send();
                });

                return;
            }

            // There is a token.
            $request.send();
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
        }
    }
})();

document.addEvent('domready', function(){

    FirebaseDatabaseAndStorageManager.init();
});