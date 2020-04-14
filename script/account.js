window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('accountNav').click();
    }, 500);

    const saveNewUsername = document.getElementById('saveNewUsername');

    saveNewUsername.addEventListener('click', () => {
        const user = firebase.auth().currentUser;
        const newUsername = document.getElementById('newUsername');
        const newUsernameFDB = document.getElementById('newUsernameFDB');
        const usernameField = document.getElementById('usernameField');

        activateLoading(.3);

        if (newUsername.value.trim() === '') {
            newUsername.classList.add('errorInput');
            newUsernameFDB.textContent = 'Feld darf nicht leer sein.';
            deactiveLoading();
        } else {
            newUsername.classList.remove('errorInput');
            newUsernameFDB.innerHTML = '&nbsp;';

            firebase.database().ref(`users/${user.uid}/userdata`).update({
                username: newUsername.value
            }).then(() => {
                deactiveLoading();
                usernameField.textContent = newUsername.value;
                showSuccessMessage('Benutzername erfolgreich geändert', 3);
                newUsername.value = '';
            }).catch(console.error);
        }
    });
});

function showSuccessMessage(text, duration) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = text;
    successMessage.classList.remove('hide');

    setTimeout(() => {
        successMessage.style.opacity = 1;
        successMessage.style.transform = 'scale(1)';

        setTimeout(() => {
            successMessage.style.opacity = 0;
            successMessage.style.transform = 'scale(.6)';

            setTimeout(() => {
                successMessage.classList.add('hide');
            }, 260);
        }, duration * 1000);
    }, 5);
}

function authorize() {
    const authorizeWrapper = document.getElementById('authorizeWrapper');
    const confirmAuthorize = document.getElementById('confirmAuthorize');
    const footer = document.getElementById('footer');
    const user = firebase.auth().currentUser;

    if (user.providerData[0].providerId === 'google.com') {
        const provider = new firebase.auth.GoogleAuthProvider();

        user.reauthenticateWithPopup(provider).then((result) => {
            authorized = true;
        }, (error) => {
            console.error(error);
        });
    } else if (user.providerData[0].providerId === 'password') {
        authorizeWrapper.classList.remove('hide');
        footer.style.zIndex = 0;
    
        confirmAuthorize.addEventListener('click', () => {
            user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, document.getElementById('authorizePW').value)).then(() => {
                authorizeWrapper.classList.add('hide');
                footer.style.zIndex = 2
                document.getElementById('authorizePW').value = '';
                authorized = true;

                setTimeout(() => {
                    authorized = false;
                }, 5 * 60000);
            }, (error) => {
                console.error(error);
            });
        });
    } else {
        showSuccessMessage('Unbekanntes Problem, versuche es später erneut.', 4);
    }
}