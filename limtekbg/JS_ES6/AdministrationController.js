/**
 * @file AdministrationController.js
 *
 * Module, which exposes administrative rights.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const AministrationController = (function () {

    const Logic = {

        init(){

            if(!FirebaseEngine){

                console.error('AdministrationController.init() FirebaseEngine is not present!');
                return;
            }

            alert(FirebaseEngine.getCurrentUser());
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function(){

    AministrationController.init();
});