var TemplateProcessorObj = {
	
	productPlaceholder: {},
	productTemplate: {},
	
	init: function(){
		
		var $self = this;
		
		$self.productPlaceholder = $('ProductPlaceHolder');
		$self.productTemplate = $('ProductTemplate');
		
		if(!$self.productPlaceholder || !$self.productTemplate){
			
			console.error('TemplateProcessorObj.init(): ProductPlaceHolder and/or ProductTemplate not found!');
			return;
		}
	},
	
	generateTemplate: function($templateData){
		
		var $self = this;
		
		var $compiled = Handlebars.compile($self.productTemplate.get('html'));
		
		var $data = $templateData[1];
		
		
		$self.productPlaceholder.set('html', $compiled($data));
	}
};

document.addEvent('domready', function(){
	
	TemplateProcessorObj.init();
});