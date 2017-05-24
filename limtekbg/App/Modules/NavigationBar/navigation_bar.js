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

        _templatePath: './Modules/NavigationBar/navigation_bar.html',
        _placeholderName: 'NavigationBarPlaceholder',
        _flexibleTemplateFactory: null,

        _navDemo: null,

        /**
         * Initialize the main functionality.
         *
         * @return void
         */

        init(){

            const selfObj = this;

            selfObj._flexibleTemplateFactory = new FlexibleTemplateFactory(
                selfObj._templatePath, selfObj._placeholderName, {}
            );

            selfObj.determinePage();
        },

        /**
         * Determines which is the page the user is currently on;
         * Calls for generating the template.
         *
         * @return void
         */

        determinePage(){

            const selfObj = this;
            const path = window.location.pathname;

            let templateInfo = [];

            switch (path){

                case '/index.html':
                    templateInfo = [
                        {name: 'Начало', path: 'index.html', current: true},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/deliveries.html':
                    templateInfo = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html', current: true},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/contacts.html':
                    templateInfo = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html', current: true},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/products.html':
                    templateInfo = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html', current: true}
                    ];
                    break;

                default:
                    templateInfo = [
                        {name: 'Начало', path: 'index.html', current: true},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;
            }

            selfObj._flexibleTemplateFactory.addCustomTemplateData( { pages: templateInfo } );
            selfObj._flexibleTemplateFactory.initProcess();
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