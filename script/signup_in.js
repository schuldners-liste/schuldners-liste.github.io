window.addEventListener('load', () => {
    const startScreen = document.getElementById('startScreen');
    const emailWrapper = document.getElementById('emailWrapper');
    const continueWithGoogle = document.getElementById('continueWithGoogle');
    const goToSignIn = document.getElementById('goToSignIn');
    const goToSignUp = document.getElementById('goToSignUp');
    const continueWithSignIn = document.getElementById('continueWithSignIn');
    const continueWithSignUp = document.getElementById('continueWithSignUp');
    const signInWrapper = document.getElementById('signInWrapper');
    const signInButton = document.getElementById('signInBtn');
    const signUpButton = document.getElementById('signUpBtn');
    const passwordForgot = document.getElementById('passwordForgot');
    const passwordForgotWrapper = document.getElementById('passwordForgotWrapper');
    const disablePasswordForgotWrapper = document.getElementById('disablePasswordForgotWrapper');
    const sendForgotEmail = document.getElementById('sendForgotEmail');
    const backButton = document.getElementById('backButton');

    initEyes();

    continueWithGoogle.addEventListener('click', () => {
        sessionStorage.setItem('choseGoogle', true);
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithRedirect(provider);
    });

    continueWithSignIn.addEventListener('click', () => {
        emailWrapper.style.left = 0;
        startScreen.classList.add('hide');
        emailWrapper.classList.remove('hide');
    });

    continueWithSignUp.addEventListener('click', () => {
        emailWrapper.style.left = '-100vw';
        startScreen.classList.add('hide');
        emailWrapper.classList.remove('hide');
    });

    backButton.addEventListener('click', () => {
        emailWrapper.style.left = 0;
        emailWrapper.classList.add('hide');
        startScreen.classList.remove('hide');
        clearInputs();
    });

    goToSignUp.addEventListener('click', () => {
        emailWrapper.style.left = '-100vw';
        setTimeout(() => {
            clearInputs();
        }, 200);
    });

    goToSignIn.addEventListener('click', () => {
        emailWrapper.style.left = 0;
        setTimeout(() => {
            clearInputs();
        }, 200);
    });

    passwordForgot.addEventListener('click', () => {
        passwordForgotWrapper.classList.remove('hide');
        disablePasswordForgotWrapper.classList.remove('hide');
        signInWrapper.style.opacity = .3;
        backButton.style.opacity = .3;

        setTimeout(() => {
            passwordForgotWrapper.style.opacity = 1;
            passwordForgotWrapper.style.transform = 'scale(1)';
        }, 5);

        setTimeout(() => {
            clearInputs();
        }, 200);
    });

    disablePasswordForgotWrapper.addEventListener('click', () => {
        passwordForgotWrapper.style.opacity = 0;
        passwordForgotWrapper.style.transform = 'scale(.6)';
        disablePasswordForgotWrapper.classList.add('hide');
        signInWrapper.style.opacity = 1;
        backButton.style.opacity = 1;
        
        setTimeout(() => {
            passwordForgotWrapper.classList.add('hide');
            clearInputs();
        }, 210);
    });

    sendForgotEmail.addEventListener('click', () => {
        const email = document.getElementById('forgotPWEmail');
        const fdb = document.getElementById('fgtEMFeedback');
        fdb.style.color = 'red';

        if (email.value === '' || email.value === ' ') {
            email.classList.add('errorInput');
            fdb.textContent = 'Es muss eine E-Mail Adresse eingegeben sein.';
        } else if (!validateEmail(email)) {
            email.classList.add('errorInput');
            fdb.textContent = 'Ungültige E-Mail Adresse.';
        } else {
            email.classList.remove('errorInput');
            fdb.innerHTML = '&nbsp;';

            firebase.auth().sendPasswordResetEmail(email.value).then(() => {
                fdb.style.color = 'black';
                fdb.textContent = 'E-Mail erfolgreich versendet.';

                setTimeout(() => {
                    disablePasswordForgotWrapper.click();
                }, 2500);
            }).catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    fdb.textContent = 'Es wurde kein Benutzer mit der angegeben E-Mail Adresse gefunden.';
                } else {
                    fdb.textContent = 'Es ist ein unbekannter Fehler aufgetreten, bitte versuche es später erneut.';
                }                
            });
        }
    });

    signInButton.addEventListener('click', () => {
        const email = document.getElementById('emailIn');
        const password = document.getElementById('passwordIn');
        const emInFeedback = document.getElementById('emInFeedback');
        const pwInFeedback = document.getElementById('pwInFeedback');
        let isValid = true;

        activateLoading(.3);

        // Email validation
        if (email.value.trim() === '') {
            // email value is empty
            emInFeedback.textContent = 'Bitte geben Sie eine E-Mail Adresse ein.';
            isValid = false;
            email.classList.add('errorInput');
        } else if (validateEmail(email.value)) {
            // email is valid
            emInFeedback.textContent = '';
            email.classList.remove('errorInput');
        } else {
            // email is invalid
            emInFeedback.textContent = 'Ungültige E-Mail Adresse.';
            email.classList.add('errorInput');
            
            isValid = false;
        }

        if (password.value.trim() === '') {
            // password value is empty
            pwInFeedback.textContent = 'Bitte geben Sie ein Passwort ein.';
            isValid = false;
            password.classList.add('errorInput');
        } else if (validatePassword(password.value)) {
            // password is valid
            pwInFeedback.textContent = '';
            password.classList.remove('errorInput');
        } else {
            // password is invalid ()
            pwInFeedback.textContent = 'Ungültiges Passwort.';
            isValid = false;
            password.classList.add('errorInput');
        }

        if (isValid) {
            const promise = firebase.auth().signInWithEmailAndPassword(email.value, password.value);
            promise.catch((error) => {
                const errorMsg = error.message;
                const messages = [
                    {message: 'The password is invalid or the user does not have a password.', feedback: 'Das eingegebene Passwort ist ungültig.', affected: 'pw'},
                    {message: 'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later', feedback: 'Der Anmelde Vorgang ist zu oft fehlgeschlagen, versuchen Sie es später erneut.', affected: ''},
                    {message: 'There is no user record corresponding to this identifier. The user may have been deleted.', feedback: 'Es wurde keine Account mit der eingegebenen E-Mail Adresse gefunden.', affected: 'em'},
                    {message: 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.', feedback: 'Zeitüberschreitung beim Anmelden. Versuche Sie es später erneut.', affected: ''},
                    {message: 'The email address is already in use by another account.', feedback: 'Die angebene E-Mail Adresse wird bereits verwendet.', affected: 'em'},
                ];

                for (const msg of messages) {
                    if (msg.message === errorMsg) {
                        if (msg.affected === 'em') {
                            emInFeedback.textContent = msg.feedback;
                            email.classList.add('errorInput');
                        } else if (msg.affected === 'pw') {
                            pwInFeedback.textContent = msg.feedback;
                            password.classList.add('errorInput');
                        }
                    }
                }

                deactiveLoading();
            });

            promise.then(() => {
                deactiveLoading();
                sessionStorage.setItem('choseGoogle', false);
            });
        } else {
            deactiveLoading();
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

        activateLoading(.3);

        // Email validation
        if (email.value.trim() === '') {
            // email value is empty
            emUpFeedback.textContent = 'Bitte geben Sie eine E-Mail Adresse ein.';
            isValid = false;
            email.classList.add('errorInput');
        } else if (validateEmail(email.value)) {
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
        if (username.value.trim() === '') {
            // username value is empty
            unUpFeedback.textContent = 'Bitte geben Sie einen Benutzernamen ein.';
            isValid = false;
            username.classList.add('errorInput');
        } else {
            // username is valid
            unUpFeedback.textContent = '';
            username.classList.remove('errorInput');
            username.value = username.value.substring(0, 24);
        }

        if (password.value === '') {
            // password value is empty
            pwUpFeedback.textContent = 'Bitte geben Sie ein Passwort ein.';
            isValid = false;
            password.classList.add('errorInput');
        } else if (validatePassword(password.value)) {
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
            } else if (password.value.length < 5) {
                // to short
                pwUpFeedback.textContent = 'Das Passwort ist zu kurz.';
            } else {
                // unknown error
                pwUpFeedback.textContent = 'Es ist ein unbekannter Fehler aufgetreten, bitte versuchen Sie es später erneut.';
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
                    {message: 'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later', feedback: 'Der Anmelde Vorgang ist zu oft fehlgeschlagen, versuchen Sie es später erneut.', affected: ''},
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

                deactiveLoading();
            });

            promise.then(() => {
                deactiveLoading();
                
                sessionStorage.setItem('choseGoogle', false);
                
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/userdata`).set({
                    username: username.value,
                    email: email.value,
                    signupdate: Date.now()
                });
            });
        } else {            
            deactiveLoading();
        }
    });

    function initEyes() {
        const pwWrapper = document.getElementsByClassName('pwWrapper');

        for (let i = 0; i < pwWrapper.length; i++) {
            for (let j = 1; j < pwWrapper[i].children.length; j++) {        
                const icon = pwWrapper[i].children[j];
                const input = pwWrapper[i].children[j-1];
                
                icon.addEventListener('click', () => {
                    if (icon.className.includes('-slash')) {
                        icon.className = icon.className.replace('-slash', '');
                        input.type = 'password';
                    } else {
                        icon.className += '-slash';
                        input.type = 'text';
                    }
                });
            }
        }
    }
});

// @param string
function validatePassword(password) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && password.length > 5;
}

// @param string
function validateEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function clearInputs() {
    const inputs = [
        document.getElementById('emailIn'),
        document.getElementById('passwordIn'),
        document.getElementById('forgotPWEmail'),
        document.getElementById('emInFeedback'),
        document.getElementById('pwInFeedback'),
        document.getElementById('emailUp'),
        document.getElementById('usernameUp'),
        document.getElementById('passwordUp'),
        document.getElementById('emUpFeedback'),
        document.getElementById('unUpFeedback'),
        document.getElementById('pwUpFeedback')
    ];

    for (const input of inputs) {
        input.value = '';
        input.textContent = '';
        input.classList.remove('errorInput');
    }
}