/**
 * @file PageDynamicsHandler.js
 *
 * Module, which is used in every page to handle the navigation bar functionality
 * and to change the quote at the bottom of the page.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 Bilger Yahov, all rights reserved.
 */

const PageDynamicsHandler = {

    navDemo: {},
    toggleNavigation: {},
    quote: {},
    listOfQuotes: [],

	/**
     * Initializes the main functionality. Gets the elements from the DOM and attaches the
     * corresponding events.
     *
     * When initializing, changes the quote.
     *
     * @return void
     */

    init: function(){

      const $self = this;

      $self.toggleNavigation = $('ToggleNavigation');
      if(!$self.toggleNavigation){

          console.error('PageDynamicsHandler.init(): ToggleNavigation is not found!');
          return;
      }

      $self.toggleNavigation.addEvent('click', function(){

         $self.toggleMenu();
      });

      $self.quote = $('Quote');
      if(!$self.quote){

          console.error('PageDynamicsHandler.init(): Quote is not found!');
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

	/**
     * Toggles the navigation bar.
     *
     * @return void
     */

    toggleMenu: function(){

      const $self = this;

      $self.navDemo = $('NavDemo');
      if(!$self.navDemo){

          console.error('PageDynamicsHandler.toggleMenu(): NavDemo is not found!');
          return;
      }

      if($self.navDemo.className.indexOf('w3-show') === -1){

          $self.navDemo.className += ' w3-show';
      }
      else{

          $self.navDemo.className = $self.navDemo.className.replace(' w3-show', '');
      }
  },

	/**
     * Changes the quote randomly.
     *
     * @return void
     */

    changeQuote: function(){

      const $self = this;

      let $number = Math.floor((Math.random() * 7));

      $self.quote.innerHTML = $self.listOfQuotes[$number];
  }
};

document.addEvent('domready', function(){

    PageDynamicsHandler.init();
});