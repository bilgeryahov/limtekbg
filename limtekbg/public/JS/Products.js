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
			
			
		
		$self.accumulatorsButt.addEvent('click', function(){
			
			
		});
	}
};

document.addEvent('domready', function(){
	
	ProductsObj.init();
});