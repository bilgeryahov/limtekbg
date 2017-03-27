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

        _loader: {},
        _pageContent: {},
        _loginForm: {},

        _inputEmail: {},
        _inputPassword: {},

        /**
         * Initializes the main functionality.
         *
         * @return void
         */

        init(){

            const $self = this;
            if(!FirebaseEngine){

                console.error('AdministrationController.init() FirebaseEngine is not present!');
                return;
            }

            $self._loader = $('Loader');
            if(!$self._loader){

                console.error('AdministrationController.init(): Loader is not found!');
                return;
            }

            $self._pageContent = $('Content');
            if(!$self._pageContent){

                console.error('AdministrationController.init(): Content is not found!');
                return;
            }

            $self._loginForm = $('LoginForm');
            if(!$self._loginForm){

                console.error('AdministrationController.init(): LoginForm is not found!');
                return;
            }

            let $loginButton = $('LoginButton');
            if(!$loginButton){

                console.error('AdministrationController.init(): LoginButton is missing!');
                return;
            }

            $self._inputEmail = $('InputEmail');
            if(!$self._inputEmail){

                console.error('AdministrationController.init(): InputEmail is missing!');
                return;
            }

            $self._inputPassword = $('InputPassword');
            if(!$self._inputPassword){

                console.error('AdministrationController.init(): InputPassword is missing!');
                return;
            }

            // Good to go.
            $loginButton.addEvent('click', function(){

                let $validation = $self.validateLoginInputs();
                if($validation === 'Everything okay'){

                    FirebaseEngine.login($self._inputEmail.value, $self._inputPassword.value);
                    $self.setAcceptingStatus();
                }
                else{

                    // TODO: Tell the user that something is wrong with the credential entered.
                }
            });

            /*
             * At first there is a need to check
             * if there is a user present. We do
             * this in order to make sure that the
             * right things are shown on the page.
             */

            FirebaseEngine.getCurrentUserFlag().addEvent('present', function(){

                $self.displayContent();
            });

            FirebaseEngine.getCurrentUserFlag().addEvent('not_present', function(){

                $self.displayLoginForm();
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

            FirebaseEngine.getCurrentUserFlag().addEvent('present', function(){

               // User is logged in!
                $self.displayContent();
            });

            FirebaseEngine.getLoginErrorFlag().addEvent('present', function(){

                // Problem while logging in!
                // TODO: Find a way to properly display error messages in the future.
                alert(FirebaseEngine.getLoginError().message);
                $self.displayLoginForm();
            });
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

    AministrationController.init();
});