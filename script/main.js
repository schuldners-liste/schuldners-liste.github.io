window.addEventListener('load', () => {
    const logInScreen = document.getElementById('logInScreen');
    const mainScreen = document.getElementById('mainScreen');
    const firebaseConfig = {
        apiKey: "AIzaSyC193EbS7F1xds4fLyh4iujaF30j-XhhrY",
        authDomain: "schuldners-liste-development.firebaseapp.com",
        databaseURL: "https://schuldners-liste-development.firebaseio.com",
        projectId: "schuldners-liste-development",
        storageBucket: "schuldners-liste-development.appspot.com",
        messagingSenderId: "1050245368401",
        appId: "1:1050245368401:web:9968259298ddbee108c670" 
    };

    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // check if userdata is already stored in the database
            if (sessionStorage.getItem('choseGoogle')) {
                firebase.database().ref(`users/${user.uid}/userdata`).once('value').then((snapshot) => {
                    if (snapshot.val() === null) {
                        firebase.database().ref(`users/${user.uid}/userdata`).set({
                            email: user.email,
                            username: user.displayName,
                            signupdate: new Date().getTime()
                        });
                    }
                });
            }

            logInScreen.classList.add('hide');
            mainScreen.classList.remove('hide');
        } else {
            logInScreen.classList.remove('hide');
            mainScreen.classList.add('hide');
        }
    });
});