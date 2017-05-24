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
        _templateFactory: null,

        _listOfQuotes: [],

        /**
         * Initializes the module.
         *
         * @return void
         */

        init(){

            const selfObj = this;

            selfObj._listOfQuotes = [
                'Опит е името, което даваме на грешките си.',
                'В днешно време хората знаят цената на всичко, но не знаят стойността на нищо.',
                'Модно е това, което носим самите ние. Не е модно онова, което носят другите хора.',
                'Винаги прощавайте на враговете си - за тях няма нищо по-дразнещо от това.',
                'Не е страшно, че грешим. Страшното е, че повтаряме грешките си.',
                'Нищо, което си струва да бъде научено, не може да бъде преподадено',
                'Истината рядко е чиста и никога проста.'
            ];

            selfObj._flexibleTemplateFactory = new FlexibleTemplateFactory(
                selfObj._templatePath, selfObj._placeholderName, {}
            );

            selfObj.getRandomQuote();
        },

        /**
         * Gets a random quote.
         *
         * @return void
         */

        getRandomQuote(){

            const selfObj = this;
            let number = Math.floor((Math.random() * 7));
            let quote = selfObj._listOfQuotes[number];
            selfObj._flexibleTemplateFactory.addCustomTemplateData( { quote: quote } );
            selfObj._flexibleTemplateFactory.initProcess();
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