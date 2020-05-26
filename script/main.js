window.addEventListener('load', () => {
    const firebaseConfig = {
        apiKey: 'AIzaSyDBR26c7FbJYLloG0lV-c22g539TDTDYGY',
        authDomain: 'schuldners-liste.firebaseapp.com',
        databaseURL: 'https://schuldners-liste.firebaseio.com',
        projectId: 'schuldners-liste',
        storageBucket: 'schuldners-liste.appspot.com',
        messagingSenderId: '654409783665',
        appId: '1:654409783665:web:b90d648514895df1e2fed0'
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

                        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/theme`).set({
                            hex: '#486491',
                            hex2: '#687fa4',
                            color: '#fff'
                        });
                    }
                });
            }

            if (window.location.pathname.includes('/join')) {
                window.location.href = `${window.location.protocol}//${window.location.host}/index.html`;
            }
        } else {
            if (!window.location.pathname.includes('/join')) {
                window.location.href = `${window.location.protocol}//${window.location.host}/join/index.html`;
            }
        }
    });
});