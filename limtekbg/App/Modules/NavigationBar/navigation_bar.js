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

            const $self = this;

            $self._flexibleTemplateFactory = new FlexibleTemplateFactory(
                $self._templatePath, $self._placeholderName, {}
            );

            $self.determinePage();
        },

        /**
         * Determines which is the page the user is currently on;
         * Calls for generating the template.
         *
         * @return void
         */

        determinePage(){

            const $self = this;
            const $path = window.location.pathname;

            let $templateInfo = [];

            switch ($path){

                case '/index.html':
                    $templateInfo = [
                        {name: 'Начало', path: 'index.html', current: true},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/deliveries.html':
                    $templateInfo = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html', current: true},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/contacts.html':
                    $templateInfo = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html', current: true},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;

                case '/products.html':
                    $templateInfo = [
                        {name: 'Начало', path: 'index.html'},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html', current: true}
                    ];
                    break;

                default:
                    $templateInfo = [
                        {name: 'Начало', path: 'index.html', current: true},
                        {name: 'Доставки', path: 'deliveries.html'},
                        {name: 'Контакти', path: 'contacts.html'},
                        {name: 'Продукти', path: 'products.html'}
                    ];
                    break;
            }

            $self._flexibleTemplateFactory.addCustomTemplateData( { pages: $templateInfo } );
            $self._flexibleTemplateFactory.initProcess();
        },

        /**
         * Toggles the navigation bar.
         *
         * @return void
         */

        toggleNavigationBar(){

            const $self = this;

            if($self._navDemo === null || typeof $self._navDemo === 'undefined'){

                $self._navDemo = $('NavDemo');
                if(!$self._navDemo){

                    console.error('NavigationBar.toggleNavigationBar(): NavDemo is not found!');
                    return;
                }
            }

            if($self._navDemo.className.indexOf('w3-show') === -1){

                $self._navDemo.className += ' w3-show';
            }
            else{

                $self._navDemo.className = $self._navDemo.className.replace(' w3-show', '');
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