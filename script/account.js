window.addEventListener('load', () => {
    const continueWithGoogle = document.getElementById('continueWithGoogle');
    const goToSignIn = document.getElementById('goToSignIn');
    const goToSignUp = document.getElementById('goToSignUp');
    const signUpWrapper = document.getElementById('signUpWrapper');
    const signInWrapper = document.getElementById('signInWrapper');
    const continueWithSignIn = document.getElementById('continueWithSignIn');
    const continueWithSignUp = document.getElementById('continueWithSignUp');
    const signUpButton = document.getElementById('signUpBtn');
    const firebaseConfig = {
        apiKey: "AIzaSyC193EbS7F1xds4fLyh4iujaF30j-XhhrY",
        authDomain: "schuldners-liste-development.firebaseapp.com",
        databaseURL: "https://schuldners-liste-development.firebaseio.com",
        projectId: "schuldners-liste-development",
        storageBucket: "schuldners-liste-development.appspot.com",
        messagingSenderId: "1050245368401",
        appId: "1:1050245368401:web:9968259298ddbee108c670" 
    };

    AOS.init();
    firebase.initializeApp(firebaseConfig);

    continueWithGoogle.addEventListener('click', () => {
        // Activate Google Login Provider
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();

        firebase.auth().signInWithRedirect(provider);

        firebase.auth().getRedirectResult().then((result) => {
            if (result.credential) {
                const token = result.credential.accessToken;
        }
        const user = result.user;

        console.log(user);

        }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        });
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
    });

    goToSignIn.addEventListener('click', () => {
        signUpWrapper.classList.remove('fadeIn');
        signUpWrapper.classList.add('fadeOut');
        signInWrapper.classList.add('fadeIn');
        signInWrapper.style.zIndex = 100;
        signUpWrapper.style.zIndex = 0;
    });

    signUpButton.addEventListener('click', () => {
        const email = document.getElementById('emailUp');
        const username = document.getElementById('usernameUp');
        const password = document.getElementById('passwordUp');
        let isValid = true;

        // Email validation
        if (email.value === '' || email.value === ' ') {
            // email value is empty
            isValid = false;
            email.style.borderColor = 'red';

            email.addEventListener('focus', () => {
                email.style.borderColor = 'red';
            });

            email.addEventListener('blur', () => {
                email.style.borderColor = 'red';
            });
        } else if (validateEmail(email)) {
            // email is valid
            email.style.borderColor = 'lightgray';

            email.addEventListener('focus', () => {
                email.style.borderColor = '#03a87c';
            });

            email.addEventListener('blur', () => {
                email.style.borderColor = 'lightgray';
            });
        } else {
            // email is invalid
            email.style.borderColor = 'red';

            email.addEventListener('focus', () => {
                email.style.borderColor = 'red';
            });

            email.addEventListener('blur', () => {
                email.style.borderColor = 'red';
            });
            
            isValid = false;
        }

        // Username validation
        if (username.value === '' || username.value === ' ') {
            // username value is empty
            isValid = false;
            username.style.borderColor = 'red';

            username.addEventListener('focus', () => {
                username.style.borderColor = 'red';
            });

            username.addEventListener('blur', () => {
                username.style.borderColor = 'red';
            });
        } else {
            // username is valid
            username.style.borderColor = 'lightgray';

            username.addEventListener('focus', () => {
                username.style.borderColor = '#03a87c';
            });

            username.addEventListener('blur', () => {
                username.style.borderColor = 'lightgray';
            });
        }

        if (password.value === '' || password.value === ' ') {
            // password value is empty
            isValid = false;
            password.style.borderColor = 'red';

            password.addEventListener('focus', () => {
                password.style.borderColor = 'red';
            });

            password.addEventListener('blur', () => {
                password.style.borderColor = 'red';
            });
        } else if (validatePassword(password)) {
            // password is valid
            password.style.borderColor = 'lightgray';

            password.addEventListener('focus', () => {
                password.style.borderColor = '#03a87c';
            });

            password.addEventListener('blur', () => {
                password.style.borderColor = 'lightgray';
            });
        } else {
            // password is invalid
            password.style.borderColor = 'red';

            password.addEventListener('focus', () => {
                password.style.borderColor = 'red';
            });

            password.addEventListener('blur', () => {
                password.style.borderColor = 'red';
            });
            
            isValid = false;
        }
    });
});

function validatePassword(password) {
    return /[a-z]/.test(password.value) && /[A-Z]/.test(password.value) && /[0-9]/.test(password.value) && password.value.length > 5;
}

function validateEmail(email) {
    const splitEmail = email.value.split('@');
    return splitEmail.length === 2 && splitEmail[1].split('.').length === 2 && splitEmail[1].split('.')[1].length >= 2;
}