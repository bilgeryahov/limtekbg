var FirebaseObj = {

	storage: {},
	storageRef: {},

	database: {},
	databaseRef: {},

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
		$self.databaseRef = $self.database.ref();
	},

	getData: function($neededData){

		var $self = this;

		if(!TemplateProcessorObj){

			console.error('FirebaseObj.getData(): TemplateProcessorObj does not exist!');
			return;
		}

		$self.databaseRef.child('products/' + $neededData)
		.once('value')
		.then(function($snapshot){

			// Send this data to TemplateProcessorObj
			TemplateProcessorObj.generateTemplate($snapshot.val());
		});
	},

	signIn: function($email, $password){


	}
};

document.addEvent('domready', function(){

	FirebaseObj.init();
});