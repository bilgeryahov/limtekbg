var MyFunctions = {
    
    navDemo: {},
    toggleNavigation: {},
    
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
  }
};

document.addEvent('domready', function(){

	MyFunctions.init();
});