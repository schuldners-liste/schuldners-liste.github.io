window.addEventListener('load', () => {
    const continueWithGoogle = document.getElementById('continueWithGoogle');
    const goToSignIn = document.getElementById('goToSignIn');
    const goToSignUp = document.getElementById('goToSignUp');
    const signUpWrapper = document.getElementById('signUpWrapper');
    const signInWrapper = document.getElementById('signInWrapper');
    const continueWithSignIn = document.getElementById('continueWithSignIn');
    const continueWithSignUp = document.getElementById('continueWithSignUp');
    const signInButton = document.getElementById('signInBtn');
    const signUpButton = document.getElementById('signUpBtn');

    AOS.init();

    continueWithGoogle.addEventListener('click', () => {
        sessionStorage.setItem('choseGoogle', true);
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithRedirect(provider);
    });

    continueWithSignIn.addEventListener('click', () => {
        document.getElementById('startScreen').classList.add('fadeOut');
        signInWrapper.classList.add('fadeIn');
        signInWrapper.style.zIndex = 100;
        signUpWrapper.style.zIndex = 0;
        continueWithGoogle.classList.add('fadeIn');
        continueWithGoogle.style.zIndex = 100;
    });

    continueWithSignUp.addEventListener('click', () => {
        document.getElementById('startScreen').classList.add('fadeOut');
        signUpWrapper.classList.add('fadeIn');
        signUpWrapper.style.zIndex = 100;
        signInWrapper.style.zIndex = 0;
        continueWithGoogle.classList.add('fadeIn');
        continueWithGoogle.style.zIndex = 100;
    });

    goToSignUp.addEventListener('click', () => {
        signInWrapper.classList.remove('fadeIn');
        signInWrapper.classList.add('fadeOut');
        signUpWrapper.classList.add('fadeIn');

        signUpWrapper.style.zIndex = 100;
        signInWrapper.style.zIndex = 0;

        setTimeout(() => {
            clearSignIn();
        }, 310);
    });

    goToSignIn.addEventListener('click', () => {
        signUpWrapper.classList.remove('fadeIn');
        signUpWrapper.classList.add('fadeOut');
        signInWrapper.classList.add('fadeIn');
        signInWrapper.style.zIndex = 100;
        signUpWrapper.style.zIndex = 0;

        setTimeout(() => {
            clearSignUp();
        }, 310);
    });

    signInButton.addEventListener('click', () => {
        const email = document.getElementById('emailIn');
        const password = document.getElementById('passwordIn');
        const emInFeedback = document.getElementById('emInFeedback');
        const pwInFeedback = document.getElementById('pwInFeedback');
        let isValid = true;

        startLoadingAnimation();

        // Email validation
        if (email.value === '' || email.value === ' ') {
            // email value is empty
            emInFeedback.textContent = 'Bitte geben Sie eine E-Mail Adresse ein.';
            isValid = false;
            email.classList.add('errorInput');
        } else if (validateEmail(email)) {
            // email is valid
            emInFeedback.textContent = '';
            email.classList.remove('errorInput');
        } else {
            // email is invalid
            emInFeedback.textContent = 'Ungültige E-Mail Adresse.';
            email.classList.add('errorInput');
            
            isValid = false;
        }

        if (password.value === '' || password.value === ' ') {
            // password value is empty
            pwInFeedback.textContent = 'Bitte geben Sie ein Passwort ein.';
            isValid = false;
            password.classList.add('errorInput');
        } else {
            // password is valid
            pwInFeedback.textContent = '';
            password.classList.remove('errorInput');
        }

        if (isValid) {
            const promise = firebase.auth().signInWithEmailAndPassword(email.value, password.value);
            promise.catch((error) => {
                const errorMsg = error.message;
                const messages = [
                    {message: 'The password is invalid or the user does not have a password.', feedback: 'Das eingegebene Passwort ist ungültig.', affected: 'pw'},
                    {message: 'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later', feedback: 'Der Anmelde Vorgang ist zu oft fehlgeschlagen, versuchen Sie es später ernuet.', affected: ''},
                    {message: 'There is no user record corresponding to this identifier. The user may have been deleted.', feedback: 'Es wurde keine Account mit der eingegebenen E-Mail Adresse gefunden.', affected: 'em'},
                    {message: 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.', feedback: 'Zeitüberschreitung beim Anmelden. Versuche Sie es später erneut.', affected: ''},
                    {message: 'The email address is already in use by another account.', feedback: 'Die angebene E-Mail Adresse wird bereits verwendet.', affected: 'em'},
                ];

                for (const msg of messages) {
                    if (msg.message === errorMsg) {
                        if (msg.affected === 'em') {
                            emUpFeedback.textContent = msg.feedback;
                            email.classList.add('errorInput');
                        } else if (msg.affected === 'pw') {
                            pwUpFeedback.textContent = msg.feedback;
                            password.classList.add('errorInput');
                        }
                    }
                }
            });

            promise.then(() => {
                stopLoadingAnimation();
                sessionStorage.setItem('choseGoogle', true);
            });
        } else {
            stopLoadingAnimation();
        }

        function startLoadingAnimation() {
            const signInBtnText = document.getElementById('signInBtnText');
            const signInloader = document.getElementById('signInloader');

            signInBtnText.style.opacity = 0;
            signInloader.style.width = (signInButton.clientWidth - 64) + 'px';
            signInloader.style.height = (signInButton.clientHeight - 64) + 'px';
            signInBtnText.style.position = 'absolute';
            signInloader.classList.remove('hide');
        }
        
        function stopLoadingAnimation() {
            const signInBtnText = document.getElementById('signInBtnText');
            const signInloader = document.getElementById('signInloader');
            
            signInloader.classList.add('hide');
            signInBtnText.style.position = 'relative';
            signInBtnText.style.opacity = 1;
        }
    });

    signUpButton.addEventListener('click', () => {
        const email = document.getElementById('emailUp');
        const username = document.getElementById('usernameUp');
        const password = document.getElementById('passwordUp');
        const emUpFeedback = document.getElementById('emUpFeedback');
        const unUpFeedback = document.getElementById('unUpFeedback');
        const pwUpFeedback = document.getElementById('pwUpFeedback');
        let isValid = true;

        startLoadingAnimation();

        // Email validation
        if (email.value === '' || email.value === ' ') {
            // email value is empty
            emUpFeedback.textContent = 'Bitte geben Sie eine E-Mail Adresse ein.';
            isValid = false;
            email.classList.add('errorInput');
        } else if (validateEmail(email)) {
            // email is valid
            emUpFeedback.textContent = '';
            email.classList.remove('errorInput');
        } else {
            // email is invalid
            emUpFeedback.textContent = 'Ungültige E-Mail Adresse.';
            email.classList.add('errorInput');
            
            isValid = false;
        }

        // Username validation
        if (username.value === '' || username.value === ' ') {
            // username value is empty
            unUpFeedback.textContent = 'Bitte geben Sie einen Benutzernamen ein.';
            isValid = false;
            username.classList.add('errorInput');
        } else {
            // username is valid
            unUpFeedback.textContent = '';
            username.classList.remove('errorInput');
        }

        if (password.value === '' || password.value === ' ') {
            // password value is empty
            pwUpFeedback.textContent = 'Bitte geben Sie ein Passwort ein.';
            isValid = false;
            password.classList.add('errorInput');
        } else if (validatePassword(password)) {
            // password is valid
            pwUpFeedback.textContent = '';
            password.classList.remove('errorInput');
        } else {
            if (!/[a-z]/.test(password.value)) {
                // no lower case letters
                pwUpFeedback.textContent = 'Bitte geben Sie auch kleine Buchstaben ein.';
            } else if (!/[A-Z]/.test(password.value)) {
                // no higer case letters 
                pwUpFeedback.textContent = 'Bitte geben Sie auch große Buchstaben ein.';
            } else if (!/[0-9]/.test(password.value)) {
                // no numbers
                pwUpFeedback.textContent = 'Bitte geben Sie auch Ziffern ein.';
            } else if (password.value.length <= 5) {
                // to short
                pwUpFeedback.textContent = 'Das Passwort ist zu kurz.';
            } else {
                // unknown error
                pwUpFeedback.textContent = 'Es ist ein unbekannter Fehler aufgetreten, versuchen Sie es später erneut.';
            }

            password.classList.add('errorInput');
            isValid = false;
        }

        if (isValid) {
            const promise = firebase.auth().createUserWithEmailAndPassword(email.value, password.value);
            promise.catch((error) => {
                const errorMsg = error.message;
                const messages = [
                    {message: 'The password is invalid or the user does not have a password.', feedback: 'Das eingegebene Passwort ist ungültig.', affected: 'pw'},
                    {message: 'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later', feedback: 'Der Anmelde Vorgang ist zu oft fehlgeschlagen, versuchen Sie es später ernuet.', affected: ''},
                    {message: 'There is no user record corresponding to this identifier. The user may have been deleted.', feedback: 'Es wurde keine Account mit der eingegebenen E-Mail Adresse gefunden.', affected: 'em'},
                    {message: 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.', feedback: 'Zeitüberschreitung beim Anmelden. Versuche Sie es später erneut.', affected: ''},
                    {message: 'The email address is already in use by another account.', feedback: 'Die angebene E-Mail Adresse wird bereits verwendet.', affected: 'em'},
                ];

                for (const msg of messages) {
                    if (msg.message === errorMsg) {
                        if (msg.affected === 'em') {
                            emUpFeedback.textContent = msg.feedback;
                            email.classList.add('errorInput');
                        } else if (msg.affected === 'pw') {
                            pwUpFeedback.textContent = msg.feedback;
                            password.classList.add('errorInput');
                        }
                    }
                }
            });

            promise.then(() => {
                stopLoadingAnimation();
                
                sessionStorage.setItem('choseGoogle', false);
                
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/userdata`).set({
                    username: username.value,
                    email: email.value,
                    signupdate: new Date().getTime()
                });
            });
        } else {            
            stopLoadingAnimation();
        }

        function startLoadingAnimation() {
            const signUpBtnText = document.getElementById('signUpBtnText');
            const signUploader = document.getElementById('signUploader');

            signUpBtnText.style.opacity = 0;
            signUploader.style.width = (signUpButton.clientWidth - 64) + 'px';
            signUploader.style.height = (signUpButton.clientHeight - 64) + 'px';
            signUpBtnText.style.position = 'absolute';
            signUploader.classList.remove('hide');
        }
        
        function stopLoadingAnimation() {
            const signUpBtnText = document.getElementById('signUpBtnText');
            const signUploader = document.getElementById('signUploader');
            
            signUploader.classList.add('hide');
            signUpBtnText.style.position = 'relative';
            signUpBtnText.style.opacity = 1;
        }
    });

    function clearSignUp() {
        const inputs = [
            document.getElementById('emailUp'),
            document.getElementById('usernameUp'),
            document.getElementById('passwordUp')
        ];

        const feedbacks = [
            document.getElementById('emUpFeedback'),
            document.getElementById('unUpFeedback'),
            document.getElementById('pwUpFeedback')
        ];

        for (const input of inputs) {
            input.value = '';
            input.classList.remove('errorInput');
        }


        for (const feedback of feedbacks) {
            feedback.textContent = '';
        }
    }

    function clearSignIn() {
        const inputs = [
            document.getElementById('emailIn'),
            document.getElementById('passwordIn')
        ];

        const feedbacks = [
            document.getElementById('emInFeedback'),
            document.getElementById('pwInFeedback')
        ];

        for (const input of inputs) {
            input.value = '';

            input.classList.remove('errorInput');
        }

        for (const feedback of feedbacks) {
            feedback.textContent = '';
        }
    }
});

function validatePassword(password) {
    return /[a-z]/.test(password.value) && /[A-Z]/.test(password.value) && /[0-9]/.test(password.value) && password.value.length > 5;
}

function validateEmail(email) {
    if (email.value.includes('@')) {
        const splitEmail = email.value.split('@');
        return splitEmail.length === 2 && splitEmail[1].split('.').length === 2 && splitEmail[1].split('.')[1].length >= 2 && splitEmail[1].split('.')[0].length >= 3;
    } else {
        return false;
    }
}