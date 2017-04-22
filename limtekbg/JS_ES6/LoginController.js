/**
 * @file LoginController.js
 *
 * Module, which exposes login controls.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

const LoginController = (function () {

    const Logic = {

        _loader: {},

        // Login form elements
        _loginForm: {},
        _inputEmail: {},
        _inputPassword: {},
        _loginButton: {},

        // LoginController's Auth Observer
        _authObserver: {},

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const $self = this;
            if(!FirebaseAuthenticationManager){

                console.error('LoginController.init() FirebaseAuthenticationManager is not present!');
                return;
            }

            if(!TemplateProcessor){

                console.error('LoginController.init(): TemplateProcessor is not present!');
                return;
            }

            $self._loader = $('Loader');
            if(!$self._loader){

                console.error('LoginController.init(): Loader is not found!');
                return;
            }

            if(!$self.getLoginFormElements()){

                return;
            }

            // Create a new Observer for the Auth state.
            $self._authObserver = new Observer();

            // Set-up my Auth update settings.
            $self._authObserver.getUpdate = function($update){

                if($update === 'USER 1'){

                    console.log('LoginController: User is here, redirecting....');
                    window.location.replace('./administration.html');
                }
                else if($update === 'USER 0'){

                    $self.displayLoginForm();
                }
                else if($update === 'ERROR 1'){

                    // Problem while logging in!
                    console.error('LoginController: ' + FirebaseAuthenticationManager.getAuthError());
                    TemplateProcessor.generateCustomMessage(FirebaseAuthenticationManager.getAuthError());
                    $self.displayLoginForm();
                }
            };

            // Add my Auth Observer as an observer to FirebaseAuthenticationManager's ObserverManager.
            FirebaseAuthenticationManager.getAuthObserverManager().addObserver($self._authObserver);

            // Always attach page element events after the observer is set. So
            // the app knows what to do in each state.

            // Attach the Login Form element events.
            $self.attachLoginFormElementEvents();
        },

        /**
         * Fetches all the Login Form elements from the DOM.
         * If something goes wrong, false is returned. Otherwise true.
         *
         * @return {boolean}
         */

        getLoginFormElements(){

            const $self = this;

            $self._loginForm = $('LoginForm');
            if(!$self._loginForm){

                console.error('LoginController.getLoginFormElements(): LoginForm is not found!');
                return false;
            }

            $self._loginButton = $('LoginButton');
            if(!$self._loginButton){

                console.error('LoginController.getLoginFormElements(): LoginButton is missing!');
                return false;
            }

            $self._inputEmail = $('InputEmail');
            if(!$self._inputEmail){

                console.error('LoginController.getLoginFormElements(): InputEmail is missing!');
                return false;
            }

            $self._inputPassword = $('InputPassword');
            if(!$self._inputPassword){

                console.error('LoginController.getLoginFormElements(): InputPassword is missing!');
                return false;
            }

            return true;
        },

        /**
         * Attaches the corresponding events to the login form elements.
         *
         * @return void
         */

        attachLoginFormElementEvents(){

            const $self = this;

            // Good to go.
            $self._loginButton.addEvent('click', function(){

                $self.attemptLogin();
            });
        },

        /**
         * Starts the login process.
         *
         * @return void
         */

        attemptLogin(){

            const $self = this;

            // Validate.
            if(
                DevelopmentHelpers.validateCorrectness($self._inputEmail.value, 'email')
                && DevelopmentHelpers.validateCorrectness($self._inputPassword.value, 'password')
                && DevelopmentHelpers.validateSecurity($self._inputEmail)
                && DevelopmentHelpers.validateSecurity($self._inputPassword)
            ){

                $self.displayLoader();
                FirebaseAuthenticationManager.login($self._inputEmail.value, $self._inputPassword.value);
            }
            else{

                console.error('LoginController.attemptLogin(): Problem with validation of the input fields.');
                TemplateProcessor.generateCustomMessage('Въвели сте неправилни символи в едно от полетата.');
            }
        },

        /**
         * Displays the Login Form, making sure
         * that everything else is hidden on the page.
         *
         * @return void
         */

        displayLoginForm(){

            const $self = this;

            $self._loginForm.style.display = 'block';
            $self._loader.style.display = 'none';
        },

        /**
         * Displays the loader, making sure
         * that everything else is hidden on the page.
         *
         * @return void
         */

        displayLoader(){

            const $self = this;

            $self._loader.style.display = 'block';
            $self._loginForm.style.display = 'none';
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function(){

    // Initialize the main functionality.
    LoginController.init();
});