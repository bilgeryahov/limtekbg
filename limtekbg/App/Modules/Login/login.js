/**
 * @file login.js
 *
 * Login module controller.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const Login = (function(){

    const Logic = {

        _templatePath: './Modules/Login/login.html',
        _placeholderName: 'LoginPlaceholder',
        _flexibleTemplateFactory: null,

        // Login's form elements
        _elementsPresent: false,
        _inputEmail: {},
        _inputPassword: {},
        _loginButton: {},

        // Login's Auth Observer
        _authObserver: {},

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const selfObj = this;

            if(!FirebaseAuthenticationManager){

                console.error('Login.init() FirebaseAuthenticationManager is not present!');
                return;
            }

            if(!CustomMessage){

                console.error('Login.init(): CustomMessage module is not present!');
                return;
            }

            if(!Loader){

                console.error('Login.init(): Loader module is not present!');
                return;
            }

            selfObj._flexibleTemplateFactory = new FlexibleTemplateFactory(
                selfObj._templatePath, selfObj._placeholderName, {}
            );

            selfObj._flexibleTemplateFactory.initProcess();
            selfObj._flexibleTemplateFactory.showPlaceholder();

            // Create a new Observer for the Auth state.
            selfObj._authObserver = new Observer();

            // Set-up my Auth update settings.
            selfObj._authObserver.getUpdate = function(update){

                if(update === 'USER 1'){

                    console.log('Login: User is here, redirecting....');
                    window.location.replace('./administration.html');
                }
                else if(update === 'USER 0'){

                    selfObj.displayLogin();
                }
                else if(update === 'ERROR 1'){

                    // Problem while logging in!
                    console.error('Login: ' + FirebaseAuthenticationManager.getAuthError());
                    CustomMessage.showMessage(FirebaseAuthenticationManager.getAuthError());
                    selfObj.displayLogin();
                }
            };

            // Add my Auth Observer as an observer to FirebaseAuthenticationManager's ObserverManager.
            FirebaseAuthenticationManager.getAuthObserverManager().addObserver(selfObj._authObserver);
        },

        /**
         * Fetches all the Login Form elements from the DOM.
         * If something goes wrong, false is returned. Otherwise true.
         *
         * @return {boolean}
         */

        getLoginFormElements(){

            const selfObj = this;

            if(selfObj._elementsPresent){

                return true;
            }

            selfObj._loginButton = $('LoginButton');
            selfObj._inputEmail = $('InputEmail');
            selfObj._inputPassword = $('InputPassword');

            selfObj._elementsPresent = (
                selfObj._loginButton !== null
                && selfObj._inputEmail !== null
                && selfObj._inputPassword !== null
            );

            return selfObj._elementsPresent;
        },

        /**
         * Starts the login process.
         *
         * @return void
         */

        attemptLogin(){

            const selfObj = this;

            // Try to fetch the elements from the DOM.
            if(!selfObj.getLoginFormElements()){

                console.error('Login.attemptLogin(): Problem with DOM elements.');
                return;
            }

            // Validate.
            if(
                DevelopmentHelpers.validateCorrectness(selfObj._inputEmail.value, 'email')
                && DevelopmentHelpers.validateCorrectness(selfObj._inputPassword.value, 'password')
                && DevelopmentHelpers.validateSecurity(selfObj._inputEmail)
                && DevelopmentHelpers.validateSecurity(selfObj._inputPassword)
            ){

                selfObj.displayLoader();
                FirebaseAuthenticationManager.login(selfObj._inputEmail.value, selfObj._inputPassword.value);
            }
            else{

                console.error('Login.attemptLogin(): Problem with validation of the input fields.');
                CustomMessage.showMessage('Въвели сте некоректна информация или символи.');
            }
        },

        /**
         * Makes sure that the Login (form or module) is displayed when needed.
         *
         * @return void.
         */

        displayLogin(){

            const selfObj = this;
            selfObj._flexibleTemplateFactory.showPlaceholder();
            Loader.hideMe();

        },

        /**
         * Makes sure that the Loader is displayed when needed.
         *
         * @return void
         */

        displayLoader(){

            const selfObj = this;
            selfObj._flexibleTemplateFactory.hidePlaceholder();
            Loader.showMe();
        }
    };

    return{

        init(){

            Logic.init();
        },

        attemptLogin(){

            Logic.attemptLogin();
        }
    }
})();

document.addEvent('domready', function () {

    Login.init();
});