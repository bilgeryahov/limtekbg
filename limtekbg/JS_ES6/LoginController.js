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

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const $self = this;
            if(!FirebaseEngine){

                console.error('LoginController.init() FirebaseEngine is not present!');
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

            // Add me as an observer for Auth.
            FirebaseEngine.addAuthObserver(LoginController);

            // Always attach page element events after the observer is set. So
            // the app knows what to do in each state.

            // Attach the Login Form element events.
            $self.attachLoginFormElementEvents();
        },

        /**
         * Get an Auth update.
         *
         * @param $update
         *
         * @return void
         */

        getAuthUpdate($update){

            const $self = this;

            if($update === 'USER 1'){

                console.log('LoginController#CurrentUserFlag: User is here, redirecting....');
                window.location.replace('./administration.html');
            }
            else if($update === 'USER 0'){

                $self.displayLoginForm();
            }
            else if($update === 'ERROR 1'){

                // Problem while logging in!
                console.error('LoginController#LoginErrorFlag: ' + FirebaseEngine.getLoginError());
                alert(FirebaseEngine.getLoginError());
                $self.displayLoginForm();
            }
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
         * Validates the login input fields for correctness.
         *
         * @return string
         */

        validateLoginInputs(){

            let $self = this;

            if($self._inputPassword.value === '' || $self._inputEmail.value === '') {

                return 'Fill in all the fields!';
            }

            let $atpos = $self._inputEmail.value.indexOf('@');
            let $dotpos = $self._inputEmail.value.indexOf('.');

            if($atpos < 0 || $dotpos < $atpos + 2 || $dotpos + 2 >= $self._inputEmail.value.length){

                return 'Enter a correct e-mail address!';
            }

            return 'Everything okay';
        },

        /**
         * Starts the login process.
         *
         * @return void
         */

        attemptLogin(){

            const $self = this;

            let $validation = $self.validateLoginInputs();
            if($validation === 'Everything okay'){

                $self.displayLoader();
                FirebaseEngine.login($self._inputEmail.value, $self._inputPassword.value);
            }
            else{

                console.log($validation);
                alert($validation);
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
        },

        getAuthUpdate($update){

            Logic.getAuthUpdate($update);
        }
    }
})();

document.addEvent('domready', function(){

    // Initialize the main functionality.
    LoginController.init();
});