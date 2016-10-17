var FirebaseObj = {
	
	storage: {},
	storageRef: {},
	
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
		
		$self.storage = firebase.storage();
		$self.storageRef = $self.storage.ref();
		
		//$self.getFile();
	},
	
	getFile: function(){
		
		var $self = this;
		
		var jsonFileRef = $self.storageRef.child('test/test.json');
		
		jsonFileRef.getDownloadURL().then(function(url){
		
			console.log('url ', url);
		})
		.catch(function(error){
			
			// TODO: Implement error.
		});
	}
}

document.addEvent('domready', function(){
	
	FirebaseObj.init();
});