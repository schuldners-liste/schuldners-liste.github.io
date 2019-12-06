window.addEventListener('load', () => {
    const continueWithGoogle = document.getElementById('continueWithGoogle');
    const goToSignIn = document.getElementById('goToSignIn');
    const goToSignUp = document.getElementById('goToSignUp');
    const signUpWrapper = document.getElementById('signUpWrapper');
    const signInWrapper = document.getElementById('signInWrapper');
    const continueWithSignIn = document.getElementById('continueWithSignIn');
    const continueWithSignUp = document.getElementById('continueWithSignUp');
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
        document.getElementById('signInWrapper').classList.add('fadeIn');
        document.getElementById('signInWrapper').style.zIndex = 100;
        continueWithGoogle.classList.add('fadeIn');
        continueWithGoogle.style.zIndex = 100;
    });

    continueWithSignUp.addEventListener('click', () => {
        document.getElementById('startScreen').classList.add('fadeOut');
        document.getElementById('signUpWrapper').classList.add('fadeIn');
        document.getElementById('signUpWrapper').style.zIndex = 100;
        continueWithGoogle.classList.add('fadeIn');
        continueWithGoogle.style.zIndex = 100;
    });
});