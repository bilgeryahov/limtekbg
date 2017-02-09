/**
 * @file FirebaseEngine.js
 *
 * Module, which exposes Firebase functionality.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

const FirebaseEngine = {

	_storage: {},
	_storageRef: {},

	_database: {},
	_databaseRef: {},

    /**
	 * Initializes the Firebase engine.
	 *
	 * @return void
     */

	init: function(){

		const $self = this;

		let $config = {
			apiKey: "AIzaSyDiXx5uys83vk-0bKdyKEfbExpZzdoChZE",
			authDomain: "limtek-fb748.firebaseapp.com",
			databaseURL: "https://limtek-fb748.firebaseio.com",
			storageBucket: "limtek-fb748.appspot.com",
			messagingSenderId: "876594439093"
		};

		firebase.initializeApp($config);

		// Initialize the storage.
		$self._storage = firebase.storage();
		$self._storageRef = $self._storage.ref();

		// Initialize the real-time database.
		$self._database = firebase.database();
		$self._databaseRef = $self._database.ref();
	},

    /**
	 * Makes a GET request to the Firebase Real Time database.
	 *
     * @param $path - path to retrieve data from
     * @param $extra - extra parameters provided
     * @param $callback - execute after completing the request
	 *
	 * @return void
     */

	firebaseGET: function($path, $extra, $callback){

		const $self = this;

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

document.addEvent('domready', function(){

	FirebaseEngine.init();
});