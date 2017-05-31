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
        _template: null,

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

            const $self = this;

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

            $self.renderTemplate();

            // Create a new Observer for the Auth state.
            $self._authObserver = new Observer();

            // Set-up my Auth update settings.
            $self._authObserver.getUpdate = function($update){

                if($update === 'USER 1'){

                    console.log('Login: User is here, redirecting....');
                    window.location.replace('./administration.html');
                }
                else if($update === 'USER 0'){

                    $self.displayLogin();
                }
                else if($update === 'ERROR 1'){

                    // Problem while logging in!
                    console.error('Login: ' + FirebaseAuthenticationManager.getAuthError());
                    CustomMessage.showMessage(FirebaseAuthenticationManager.getAuthError());
                    $self.displayLogin();
                }
            };

            // Add my Auth Observer as an observer to FirebaseAuthenticationManager's ObserverManager.
            FirebaseAuthenticationManager.getAuthObserverManager().addObserver($self._authObserver);
        },

        /**
         * Renders the template.
         *
         * @return void
         */

        renderTemplate(){

            const $self = this;

            $self._template = new Template(
                $self._templatePath, $self._placeholderName, {}
            );

            $self._template.displayMain();
        },

        /**
         * Fetches all the Login Form elements from the DOM.
         * If something goes wrong, false is returned. Otherwise true.
         *
         * @return {boolean}
         */

        getLoginFormElements(){

            const $self = this;

            if($self._elementsPresent){

                return true;
            }

            $self._loginButton = $('LoginButton');
            $self._inputEmail = $('InputEmail');
            $self._inputPassword = $('InputPassword');

            $self._elementsPresent = (
                $self._loginButton !== null
                && $self._inputEmail !== null
                && $self._inputPassword !== null
            );

            return $self._elementsPresent;
        },

        /**
         * Starts the login process.
         *
         * @return void
         */

        attemptLogin(){

            const $self = this;

            // Try to fetch the elements from the DOM.
            if(!$self.getLoginFormElements()){

                console.error('Login.attemptLogin(): Problem with DOM elements.');
                return;
            }

            // Validate.
            if(
                DevelopmentHelpers.validateCorrectness($self._inputEmail.value, 'email')
                && DevelopmentHelpers.validateCorrectness($self._inputPassword.value, 'password')
            )
            {

                $self.displayLoader();
                FirebaseAuthenticationManager.login($self._inputEmail.value, $self._inputPassword.value);
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

            const $self = this;
            $self._template.makeVisible();
            Loader.hideMe();
        },

        /**
         * Makes sure that the Loader is displayed when needed.
         *
         * @return void
         */

        displayLoader(){

            const $self = this;
            $self._template.makeInvisible();
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