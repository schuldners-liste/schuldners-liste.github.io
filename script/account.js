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
            newUsernameFDB.textContent = 'Benutzername darf nicht leer sein.';
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