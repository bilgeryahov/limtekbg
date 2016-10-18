var ProductsObj = {
	
	// Buttons on Products page.
	secondHandMachinesButt: {},
	accumulatorsButt: {},
	
	init: function(){
		
		var $self = this;
		
		$self.secondHandMachinesButt = $('SecondHandMachines');
		$self.accumulatorsButt = $('Accumulators');
		
		if(!$self.secondHandMachinesButt || !$self.accumulatorsButt){
			
			console.error('ProductsObj.init(): One of the buttons for products does not exist!');
			return;
		}
		
		if(!FirebaseObj){
			
			console.error('ProductsObj.init(): FirebaseObj does not exist!');
			return;
		}
		
		$self.secondHandMachinesButt.addEvent('click', function(){
			
			FirebaseObj.getProducts('second_hand_machines');
		});
		
		$self.accumulatorsButt.addEvent('click', function(){
			
			FirebaseObj.getProducts('accumulators');
		});
	}
};

document.addEvent('domready', function(){
	
	ProductsObj.init();
});