/**
 * 
 */

var MyFunctions = {
    
  init: function(){
      
      var $self = this;
      
      var $openOpenAble = $('OpenOpenAble');
      
      if(!$openOpenAble){
          
          console.error('MyFunctions.init: the $openOpenAble element is missing!');
          return;
      }
      
      $openOpenAble.addEvent('click', function(){

          $self.openNavigationElement();
      });
  },
  
  openNavigationElement: function(){
      
      var $openAble = $('OpenAble');
      
      if(!$openAble){
          
          console.error('MyFunctions.openNavigationElement: the $openAble element is missing!');
          return;
      }
      
      if($openAble.className.indexOf('w3-show') === -1){
          
          $openAble.className += ' w3-show';
      }
      else{
          
          $openAble.className = $openAble.className.replace(' w3-show', '');
      }
  }
};

document.addEvent('domready', function(){

	MyFunctions.init();
});