window.addEventListener('load', () => {
    const subject = document.getElementById('subject');
    const feedbackSubjectFDB = document.getElementById('feedbackFDB');
    const message = document.getElementById('message');
    const sendEmailButton = document.getElementById('sendEmailButton');

    sendEmailButton.addEventListener('click', () => {
        activateLoading(.3);
        let isValid = true;

        const elements = [
            {value: message.value, errorMessage: 'Bitte geben Sie ein Datum ein.', errorID: 'messageFDB'},
            {value: subject.value, errorMessage: 'Bitte geben Sie eine Begründung ein.', errorID: 'subjectFDB'},
        ];

        for (const elmt of elements) {
            if (elmt.value.trim() === '') {
                document.getElementById(elmt.errorID.replace('FDB', '')).classList.add('errorInput');
                document.getElementById(elmt.errorID).textContent = elmt.errorMessage;
                isValid = false;
            } else {
                document.getElementById(elmt.errorID.replace('FDB', '')).classList.remove('errorInput');
                document.getElementById(elmt.errorID).textContent = '';
            }
        }

        if (isValid) {
            firebase.database().ref(`public/messages/${Date.now()}`).set({
                email: firebase.auth().currentUser.email,
                subject: subject.value,
                message: message.value
            }).then(() => {
                deactiveLoading();
                feedbackSubjectFDB.textContent = 'Nachricht erfolgreich gesendet.';
                clearFeedbackInputs();

                setTimeout(() => {
                    feedbackSubjectFDB.textContent = '';
                }, 3000);
            });
        } else {
            deactiveLoading();
        }
    });
});

function clearFeedbackInputs() {
    const elements = [
        document.getElementById('message'),
        document.getElementById('subject'),
        document.getElementById('messageFDB'),
        document.getElementById('subjectFDB')
    ];

    for (const element of elements) {
        element.classList.remove('errorInput');
        element.value = '';
        element.textContent = '';
    }
}