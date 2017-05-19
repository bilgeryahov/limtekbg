/**
 * @file navigation_bar.js
 *
 * NavigationBar module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const NavigationBar = (function(){

    const Logic = {

        _template: null,
        _placeholder: null,
        _templatePath: './Modules/NavigationBar/navigation_bar.html',

        _navDemo: null,

        /**
         * Gets the template and placeholder. If goes successful, calls
         * for setting up the right page on the navigation.
         *
         * @return void
         */

        init(){

            if(!Handlebars){

                console.error('NavigationBar.init(): Handlebars is not present!');
                return;
            }

            const selfObj = this;

            selfObj._template = $('NavigationBarTemplate');
            selfObj._placeholder = $('NavigationBarPlaceholder');

            new Request({
                url: selfObj._templatePath,
                method: 'get',
                onSuccess(data){
                    return selfObj.determinePage(data);
                }
            }).send();
        },

        /**
         * Determines which is the page the user is currently on.
         *
         * @param pageContent
         *
         * @return execution of last function
         */

        determinePage(pageContent){

            const selfObj = this;
            const path = window.location.pathname;

            let templateInfo = {current: '', rest: []};

            switch (path){

                case '/index.html':
                    templateInfo.current = 'Начало';
                    templateInfo.rest = [
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                    templateInfo.rest = [
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/deliveries.html':
                    templateInfo.current = 'Доставки';
                    templateInfo.rest = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/contacts.html':
                    templateInfo.current = 'Контакти';
                    templateInfo.rest = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/products.html':
                    templateInfo.current = 'Продукти';
                    templateInfo.rest = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'}
                    ];
                    break;

                default:
                    templateInfo.current = 'Начало';
                    templateInfo.rest = [
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;
            }

            return selfObj.generateTemplate(pageContent, templateInfo);
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
            selfObj._placeholder.set('html', compiled({current: templateInfo.current, rest: templateInfo.rest}));
        },

        /**
         * Toggles the navigation bar.
         *
         * @return void
         */

        toggleNavigationBar(){

            const selfObj = this;

            if(selfObj._navDemo === null || typeof selfObj._navDemo === 'undefined'){

                selfObj._navDemo = $('NavDemo');
                if(!selfObj._navDemo){

                    console.error('NavigationBar.toggleNavigationBar(): NavDemo is not found!');
                    return;
                }
            }

            if(selfObj._navDemo.className.indexOf('w3-show') === -1){

                selfObj._navDemo.className += ' w3-show';
            }
            else{

                selfObj._navDemo.className = selfObj._navDemo.className.replace(' w3-show', '');
            }
        }
    };

    return{

        init(){

            Logic.init();
        },

        toggleNavigationBar(){

            Logic.toggleNavigationBar();
        }
    }

})();

document.addEvent('domready', function () {

    NavigationBar.init();
});