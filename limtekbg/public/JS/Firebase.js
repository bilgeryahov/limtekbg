var FirebaseObj = {
	
	storage: {},
	storageRef: {},
	
	database: {},
	
	init: function(){
		
		var $self = this;
		
		var config = {
			apiKey: "AIzaSyDiXx5uys83vk-0bKdyKEfbExpZzdoChZE",
			authDomain: "limtek-fb748.firebaseapp.com",
			databaseURL: "https://limtek-fb748.firebaseio.com",
			storageBucket: "limtek-fb748.appspot.com",
			messagingSenderId: "876594439093"
		};
		
		firebase.initializeApp(config);
		
		// Initialize the storage.
		$self.storage = firebase.storage();
		$self.storageRef = $self.storage.ref();
		
		// Initialize the real-time database.
		$self.database = firebase.database();
	}
}

document.addEvent('domready', function(){
	
	FirebaseObj.init();
});