/**
 * @file AdministrationController.js
 *
 * Module, which exposes administration controls.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AdministrationController = (function () {

    const Logic = {

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            alert('AdministrationController.init(): Initialized!');
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function(){

    AdministrationController.init();
});