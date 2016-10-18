var FunctionsObj = {
    
    navDemo: {},
    toggleNavigation: {},
    quote: {},
    listOfQuotes: [],
	
  init: function(){
      
      var $self = this;
      
      $self.toggleNavigation = $('ToggleNavigation');
      if(!$self.toggleNavigation){
          
          console.error('MyFunctions.init(): ToggleNavigation is not found!');
          return;
      }
      
      $self.toggleNavigation.addEvent('click', function(){
          
         $self.toggleMenu(); 
      });
      
      $self.quote = $('Quote');
      if(!$self.quote){
          
          console.error('MyFunctions.init(): Quote is not found!');
          return;
      } 
	  
      $self.listOfQuotes = [
        'Опит е името, което даваме на грешките си.',
        'В днешно време хората знаят цената на всичко, но не знаят стойността на нищо.',
        'Модно е това, което носим самите ние. Не е модно онова, което носят другите хора.',
        'Винаги прощавайте на враговете си - за тях няма нищо по-дразнещо от това.',
        'Не е страшно, че грешим. Страшното е, че повтаряме грешките си.',
        'Нищо, което си струва да бъде научено, не може да бъде преподадено',
        'Истината рядко е чиста и никога проста.'
      ];
      
      // Call the function to change the quote.
      $self.changeQuote();
  },
  
  toggleMenu: function(){
      
      var $self = this;
      
      $self.navDemo = $('NavDemo');
      if(!$self.navDemo){
          
          console.error('MyFunctions.toggleMenu(): NavDemo is not found!');
          return;
      }
      
      if($self.navDemo.className.indexOf('w3-show') === -1){
          
          $self.navDemo.className += ' w3-show';
      }
      else{
          
          $self.navDemo.className = $self.navDemo.className.replace(' w3-show', '');
      }
  },
  
  changeQuote: function(){
      
      var $self = this;
      
      var $number = Math.floor((Math.random() * 7));
      
      $self.quote.innerHTML = $self.listOfQuotes[$number];
  }
};

document.addEvent('domready', function(){

	FunctionsObj.init();
});