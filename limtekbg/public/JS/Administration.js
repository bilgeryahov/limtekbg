var AdministrationObj = {

	openLoginModal: {},
	loginButton: {},
	loginModal: {},
	emailPlaceHolder: {},
	passwordPlaceHolder: {},

	email: '',
	password: '',

	init: function(){

		var $self = this;

		$self.openLoginModal = $('OpenLoginModal');
		if(!$self.openLoginModal){

			console.error('AdministrationObj.init(): #OpenLoginModal not found!');
			return;
		}

		$self.loginButton = $('LoginButton');
		if(!$self.loginButton){

			console.error('Aministration.init(): #LoginButton not found!');
			return;
		}

		$self.loginModal = $('LoginModal');
		if(!$self.loginModal){

			console.error('Aministration.init(): #LoginModal not found!');
			return;
		}

		$self.emailPlaceHolder = $('Email');
		$self.passwordPlaceHolder = $('Password');

		if(!$self.emailPlaceHolder || !$self.passwordPlaceHolder){

			console.error('Aministration.init(): #Email or #Password  not found!');
			return;
		}

		$self.openLoginModal.addEvent('click', function(){

			$self.loginModal.style.display='block';
		});

		$self.loginButton.addEvent('click', function(){

			alert($self.emailPlaceHolder.value + ' ' + $self.passwordPlaceHolder.value);
		});
	}
};

document.addEvent('domready', function(){

	AdministrationObj.init();
});