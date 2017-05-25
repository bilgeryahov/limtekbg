/**
 * @file quote_of_the_day.js
 *
 * QuoteOfTheDay module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const QuoteOfTheDay = (function(){

    const Logic = {

        _templatePath: './Modules/QuoteOfTheDay/quote_of_the_day.html',
        _placeholderName: 'QuoteOfTheDayPlaceholder',
        _flexibleTemplateFactory: null,

        _listOfQuotes: [],

        /**
         * Initializes the module.
         *
         * @return void
         */

        init(){

            const $self = this;

            $self._listOfQuotes = [
                'Опит е името, което даваме на грешките си.',
                'В днешно време хората знаят цената на всичко, но не знаят стойността на нищо.',
                'Модно е това, което носим самите ние. Не е модно онова, което носят другите хора.',
                'Винаги прощавайте на враговете си - за тях няма нищо по-дразнещо от това.',
                'Не е страшно, че грешим. Страшното е, че повтаряме грешките си.',
                'Нищо, което си струва да бъде научено, не може да бъде преподадено',
                'Истината рядко е чиста и никога проста.'
            ];

            $self._flexibleTemplateFactory = new FlexibleTemplateFactory(
                $self._templatePath, $self._placeholderName, {}
            );

            $self.getRandomQuote();
        },

        /**
         * Gets a random quote.
         *
         * @return void
         */

        getRandomQuote(){

            const $self = this;
            let $number = Math.floor((Math.random() * 7));
            let $quote = $self._listOfQuotes[$number];
            $self._flexibleTemplateFactory.addCustomTemplateData( { quote: $quote } );
            $self._flexibleTemplateFactory.initProcess();
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function () {

    QuoteOfTheDay.init();
});