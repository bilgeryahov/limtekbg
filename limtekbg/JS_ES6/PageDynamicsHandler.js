/**
 * @file PageDynamicsHandler.js
 *
 * Module, which is used in every page to handle the navigation bar functionality
 * and to change the quote at the bottom of the page.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2016 - 2017 Bilger Yahov, all rights reserved.
 */

const PageDynamicsHandler = (function(){

    const Logic = {

        _navDemo: {},
        _toggleNavigation: {},
        _quote: {},
        _listOfQuotes: [],

        /**
         * Initializes the main functionality. Gets the elements from the DOM and attaches the
         * corresponding events.
         *
         * When initializing, changes the quote.
         *
         * @return void
         */

        init(){

            const $self = this;

            $self._toggleNavigation = $('ToggleNavigation');
            if(!$self._toggleNavigation){

                console.error('PageDynamicsHandler.init(): ToggleNavigation is not found!');
                return;
            }

            $self._toggleNavigation.addEvent('click', function(){

                $self.toggleMenu();
            });

            $self._quote = $('Quote');
            if(!$self._quote){

                console.error('PageDynamicsHandler.init(): Quote is not found!');
                return;
            }

            $self._listOfQuotes = [
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

        toggleMenu(){

            const $self = this;

            $self._navDemo = $('NavDemo');
            if(!$self._navDemo){

                console.error('PageDynamicsHandler.toggleMenu(): NavDemo is not found!');
                return;
            }

            if($self._navDemo.className.indexOf('w3-show') === -1){

                $self._navDemo.className += ' w3-show';
            }
            else{

                $self._navDemo.className = $self._navDemo.className.replace(' w3-show', '');
            }
        },

        /**
         * Changes the quote randomly.
         *
         * @return void
         */

        changeQuote(){

            const $self = this;

            let $number = Math.floor((Math.random() * 7));

            $self._quote.innerHTML = $self._listOfQuotes[$number];
        }
    };

    return{

        init(){

            Logic.init();
        },

        toggleMenu(){

            Logic.toggleMenu();
        },

        changeQuote(){

            Logic.changeQuote();
        }
    }
})();

document.addEvent('domready', function(){

    PageDynamicsHandler.init();
});