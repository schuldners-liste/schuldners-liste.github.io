window.addEventListener('load', () => {
    const continueWithGoogle = document.getElementById('continueWithGoogle');

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
});