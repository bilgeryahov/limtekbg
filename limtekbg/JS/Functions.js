/**
 * 
 */

var MyFunctions = {
    
  slideIndex: 1,
    
  init: function(){
      
      var $self = this;
      
      $prevImg = $('PrevImg');
      if(!$prevImg){
          
          console.error('MyFunctions.init: PrevImg element not found!');
          return;
      }
      
      $nextImg = $('NextImg');
      if(!$nextImg){
          
          console.error('MyFunctions.init: NextImg element not found!');
          return;
      }
      
      $prevImg.addEvent('click', function(){
          
          $self.plusDivs(-1);
      });
      
      $nextImg.addEvent('click', function(){
          
          $self.plusDivs(1);
      });
      
      $self.showDivs($self.slideIndex);
  },
  
  showDivs: function($number){
      
      var $self = this;
      
      var $mySlides = document.getElementsByClassName("mySlides");
      if(!$mySlides){
          
          console.error('MyFunctions.showDivs: elements from class "mySlides" not found!');
          return;
      }
      
      var $numberedButtons = document.getElementsByClassName("demo");
      if(!$numberedButtons){
          
          console.error('MyFunctions.showDivs: elements from class "demo" not found!');
          return;
      }
      
      if($number > $mySlides.length){
          
          $self.slideIndex = 1;
      }
      
      if($number < 1){
          
          $self.slideIndex = $mySlides.length;
      }
      
      for(var $i = 0; $i < $mySlides.length; $i++){
          
          $mySlides[$i].style.display = 'none';
      }
      
      for(var $j = 0; $j < $numberedButtons.length; $j++){
          
          $numberedButtons[$j].className = $numberedButtons[$j].className.replace(' w3-red', '');
      }
      
      $mySlides[$self.slideIndex - 1].style.display = 'block';
      $numberedButtons[$self.slideIndex - 1].className += ' w3-red';
  },
  
  plusDivs: function($number){
      
      var $self = this;
      $self.showDivs($self.slideIndex += $number);
  }
};

document.addEvent('domready', function(){

	MyFunctions.init();
});