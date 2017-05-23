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

        _template: null,
        _placeholder: null,
        _templatePath: './Modules/QuoteOfTheDay/quote_of_the_day.html',

        _listOfQuotes: [],

        /**
         * Gets the template and placeholder. If goes successful, calls
         * for generating the template.
         *
         * @return void
         */

        init(){

            if(!Handlebars){

                console.error('QuoteOfTheDay.init(): Handlebars is not present!');
                return;
            }

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

            selfObj._template = $('QuoteOfTheDayTemplate');
            selfObj._placeholder = $('QuoteOfTheDayPlaceholder');

            if(!selfObj._template || !selfObj._placeholder){

                console.error('QuoteOfTheDay.init(): Template Or Placeholder not found!');
                return;
            }

            new Request({
                url: selfObj._templatePath,
                method: 'get',
                onSuccess(data){
                    return selfObj.getRandomQuote(data);
                },
                onFailure(){
                    console.error('QuoteOfTheDay.init(): Failed while getting the template! Aborting!');
                }
            }).send();
        },

        /**
         * Gets a random quote.
         *
         * @param pageContent
         *
         * @return execution of final function.
         */

        getRandomQuote(pageContent){

            const selfObj = this;
            let number = Math.floor((Math.random() * 7));
            let quote = selfObj._listOfQuotes[number];

            return selfObj.generateTemplate(pageContent, quote);
        },

        /**
         * Generates the template using Handlebars.
         *
         * @param pageContent
         * @param templateInfo
         *
         * @return void
         */

        generateTemplate(pageContent, templateInfo){
            const selfObj = this;
            const compiled = Handlebars.compile(pageContent);
            selfObj._placeholder.set('html', compiled({quote: templateInfo}));
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