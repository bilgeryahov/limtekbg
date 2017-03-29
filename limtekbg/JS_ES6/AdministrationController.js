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

        // Page elements.
        _pageContent: {},
        _logoutButton: {},

        // AdministrationController's Auth Observer
        _authObserver: {},

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const $self = this;

            if(!FirebaseEngine){

                console.error('AdministrationController.init(): FirebaseEngine is not present!');
                return;
            }

            if(!$self.getPageElements()){

                return;
            }

            // Create a new Observer for the Auth state.
            $self._authObserver = new Observer();

            // Set-up my Auth update settings.
            $self._authObserver.getUpdate = function($update){

                if($update === 'USER 1'){

                    // TODO: User is here
                    console.log('AdministrationController: user is here ' + FirebaseEngine.getCurrentUser().email);
                }
                else if($update === 'USER 0'){

                    // The user just logged out.
                    console.log('AdministrationController: User is not here, redirecting...');
                    window.location.replace('./login.html');
                }
                else if($update === 'ERROR 1'){

                    // An error happended.
                }
            };

            // Add my Auth Observer as an observer to FirebaseEngine's ObserverManager.
            FirebaseEngine.getAuthObserverManager().addObserver($self._authObserver);

            // Always attach page element events after the observer is set. So
            // the app knows what to do in each state.

            // After you successfully get the page elements, try to attach their events.
            $self.attachPageElementsEvents();
        },

        /**
         * Get the elements from the DOM.
         * If something is missing return false, otherwise true.
         *
         * @return {boolean}
         */

        getPageElements(){

            const $self = this;

            $self._pageContent = $('PageContent');
            if(!$self._pageContent){

                console.error('AdministrationController.getPageElements(): PageContent is not found!');
                return false;
            }

            $self._logoutButton = $('LogoutButton');
            if(!$self._logoutButton){

                console.error('AdministrationController.getPageElements(): LogoutButton is not found!');
                return false;
            }

            return true;
        },

        /**
         * Attaches the corresponding events to the DOM elements.
         *
         * @return void
         */

        attachPageElementsEvents(){

            const $self = this;

            $self._logoutButton.addEvent('click', function(){

                FirebaseEngine.logout(function($error, $success){

                    return $self.handleLogout($error, $success);
                });
            });
        },

        /**
         * Handles the loging out.
         *
         * @param $error
         * @param $success
         *
         * return void
         */

        handleLogout($error, $success){

            if($error){

                console.error('AdministrationController.handleLogout(): ' + $error);
                alert($error);
                return;
            }

            if($success){

                console.log('AdministrationController.handleLogout(): logout was successful.');
            }
        },
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function(){

    // Initialize the main functionality.
    AdministrationController.init();
});