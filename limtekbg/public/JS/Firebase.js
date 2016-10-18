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
	},
	
	getProducts: function($products){
		
		var $self = this;
		var $currRef = null;
		
		switch($products){
			
			case 'second_hand_machines':
				$currRef = $self.storageRef.child('Products/' + $products + '.json');
			break;
			
			case 'accumulators':
				$currRef = $self.storageRef.child('Products/' + $products + '.json');
			break;
			
			default:
				console.error('FirebaseObj.getProducts(): No such category products!', $products);
			break;
		}
		
		if($currRef !== null){
			
			$currRef.getDownloadURL()
			.then(function($url){
			
				console.log('FirebaseObj.getProducts(): Just got ', $url);
			})
			.catch(function($err){
				
				// TODO: Handle the exceptions.
			});
		}
	}
}

document.addEvent('domready', function(){
	
	FirebaseObj.init();
});