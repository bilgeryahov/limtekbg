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

        // Page content elements.
        _pageContent: {},
        _logoutButton: {},

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

            if(!$self.getPageContentElements()){

                return;
            }

            if(!$self.getLoginFormElements()){

                return;
            }

            // Attach the Login Form element events.
            $self.attachLoginFormElementEvents();

            // Attach the Page Content element events.
            $self.attachPageContentElementEvents();

            /*
             * At first there is a need to check
             * if there is a user present. We do
             * this in order to make sure that the
             * right things are shown on the page.
             */

            FirebaseEngine.getCurrentUserFlag().removeEvents('present');
            FirebaseEngine.getCurrentUserFlag().addEvent('present', function(){

                $self.displayContent();
            });

            FirebaseEngine.getCurrentUserFlag().removeEvents('not_present');
            FirebaseEngine.getCurrentUserFlag().addEvent('not_present', function(){

                $self.displayLoginForm();
            });
        },

        /**
         * Gets the elements for the page content from the DOM.
         * If something goes wrong, false is returned. Otherwise true.
         *
         * @return {boolean}
         */

        getPageContentElements(){

            const $self = this;

            $self._pageContent = $('Content');

            if(!$self._pageContent){

                console.error('LoginController.getPageContentElements(): Content is not found!');
                return false;
            }

            $self._logoutButton = $('LogoutButton');
            if(!$self._logoutButton){

                console.error('LoginController.getPageContentElements(): LogoutButton is not found!');
                return false;
            }

            return true;
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
         * Attaches the corresponding events to the page content elements.
         *
         * @return void
         */

        attachPageContentElementEvents(){

            const $self = this;

            $self._logoutButton.addEvent('click', function(){

               FirebaseEngine.logout(function($error, $success){

                   return $self.handleLogout($error, $success);
               });
            });
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
         * Usually called after loging in.
         * Handles if the login was successful or not.
         *
         * @return void
         */

        setAcceptingStatus(){

            const $self = this;

            // First display me the loader.
            $self.displayLoader();

            /*
             * Usually after login is fired two things can happen.
             * Either the (admin) user will get logged in or an
             * error will occur. Since at first there is no user present,
             * getCurrentUserFlag will be fired for 'present' if the admin comes.
             * Otherwise, if something goes wrong while logging in, getLoginErrorFlag will
             * be fired for an error 'present'.
             */

            FirebaseEngine.getCurrentUserFlag().removeEvents('present');
            FirebaseEngine.getCurrentUserFlag().addEvent('present', function(){

                $self.displayContent();
            });

            FirebaseEngine.getLoginErrorFlag().removeEvents('present');
            FirebaseEngine.getLoginErrorFlag().addEvent('present', function(){

                // Problem while logging in!
                console.error('#LoginErrorFlag: ' + FirebaseEngine.getLoginError());
                alert(FirebaseEngine.getLoginError());
                $self.displayLoginForm();
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

                console.error('LoginController.handleLogout(): ' + $error);
                alert($error);
                return;
            }

            if($success){

                // Log out was successful.
                console.log('LoginController.handleLogout(): logout was successful.');
            }
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

                FirebaseEngine.login($self._inputEmail.value, $self._inputPassword.value);
                $self.setAcceptingStatus();
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
            $self._pageContent.style.display = 'none';
        },

        /**
         * Displays the page content, making sure
         * that everything else is hidden on the page.
         *
         * @return void
         */

        displayContent(){

            const $self = this;

            $self._pageContent.style.display = 'block';
            $self._loader.style.display = 'none';
            $self._loginForm.style.display = 'none';
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
            $self._pageContent.style.display = 'none';
        }
    };

    return{

        init(){

            Logic.init();
        }
    }
})();

document.addEvent('domready', function(){

    LoginController.init();
});