window.addEventListener('load', () => {

  const config = {
    apiKey: "AIzaSyDW8BFHDpNA2C80hYDlF-iSVpawHeek_Mo",
    authDomain: "schulden-verwaltung.firebaseapp.com",
    databaseURL: "https://schulden-verwaltung.firebaseio.com",
    projectId: "schulden-verwaltung",
    storageBucket: "schulden-verwaltung.appspot.com",
    messagingSenderId: "348756034907",
    appId: "1:348756034907:web:d68eba86f4d6bb8a"
  };

  firebase.initializeApp(config);
  const database = firebase.database();

  const userIcon = document.getElementById('user');
  const homeIcon = document.getElementById('home');
  const plusIcon = document.getElementById('plus');
  const signOutIcon = document.getElementById('signOut');
  const gotToSignUp = document.getElementById('goToSignUp');
  const gotToSignIn = document.getElementById('goToSignIn');
  const signUpBtn = document.getElementById('signUpBtn');
  const signInBtn = document.getElementById('signInBtn');
  const addEntryBtn = document.getElementById('addEntryBtn');

  userIcon.addEventListener('click', () => {
    fadeOut('contentWrapper');
    fadeOut('plusWrapper');
    changeDisplayProperty('accountWrapper', 'block');
    fadeIn('accountWrapper');

    setTimeout(() => {
      changeDisplayProperty('plusWrapper', 'none');
      changeDisplayProperty('contentWrapper', 'none');
    }, 800);
  });

  homeIcon.addEventListener('click', () => {

    fadeOut('accountWrapper');
    fadeOut('plusWrapper');
    changeDisplayProperty('contentWrapper', 'block');

    setTimeout(() => {
      fadeIn('contentWrapper');
    }, 10);

    setTimeout(() => {
      changeDisplayProperty('plusWrapper', 'none');
      changeDisplayProperty('accountWrapper', 'none');
    }, 800);
  });

  plusIcon.addEventListener('click', () => {
    initDateValue();
    fadeOut('accountWrapper');
    fadeOut('contentWrapper');
    changeDisplayProperty('plusWrapper', 'block');

    setTimeout(() => {
      fadeIn('plusWrapper');
    }, 10);

    setTimeout(() => {
      changeDisplayProperty('contentWrapper', 'none');
      changeDisplayProperty('accountWrapper', 'none');
    }, 800);
  });

  signOutIcon.addEventListener('click', () => {
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      printEntries(user.uid);
      changeDisplayProperty('user', 'none');
      changeDisplayProperty('signOut', 'block');
      fadeIn('addWrapper');
      changeDisplayProperty('addWrapper', 'block');
      document.getElementById('addFDB').textContent = '';
      document.getElementById('entryFDB').textContent = '';
    } else {
      changeDisplayProperty('user', 'block');
      changeDisplayProperty('signOut', 'none');

      const patternWrapper = document.getElementById('entryWrapper');
      while (patternWrapper.firstChild) patternWrapper.removeChild(patternWrapper.firstChild);

      document.getElementById('entryFDB').textContent = 'Keine Einträge verfügbar.';
      document.getElementById('addFDB').textContent = 'Sie müssen angemeldet sein um Einträge erstellen zu können.';

      fadeOut('addWrapper');
      changeDisplayProperty('addWrapper', 'none');
    }
  });

  gotToSignUp.addEventListener('click', () => {
    changeDisplayProperty('signUp', 'block');
    fadeOut('signIn');

    setTimeout(() => {
      fadeIn('signUp');
    }, 10);

    setTimeout(() => {
      changeDisplayProperty('signIn', 'none');
    }, 800);
  });

  gotToSignIn.addEventListener('click', () => {
    changeDisplayProperty('signIn', 'block');
    fadeOut('signUp');

    setTimeout(() => {
      fadeIn('signIn');
    }, 10);

    setTimeout(() => {
      changeDisplayProperty('signUp', 'none');
    }, 800);
  });

  signUpBtn.addEventListener('click', () => {
    const email = document.getElementById('emailSignUp');
    const username = document.getElementById('usernameSignUp');
    const password = document.getElementById('passwordSignUp');
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
        promise.catch((error) => {
          // an error happend
        });

        promise.then(() => {
          const userId = firebase.auth().currentUser.uid;
          writeUserToDatabase(username.value, email.value, userId);
          homeIcon.click();
        });
  });

  signInBtn.addEventListener('click', () => {
    const email = document.getElementById('emailSignIn');
    const password = document.getElementById('passwordSignIn');
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
        promise.catch((error) => {
          // an error happend
        });
        promise.then(() => {
          homeIcon.click();
        })
  });

  addEntryBtn.addEventListener('click', () => {
    const name = document.getElementById('name');
    const reason = document.getElementById('reason');
    const date = document.getElementById('date');
    const sum = document.getElementById('sum');
    const userId = firebase.auth().currentUser.uid;
    const currentDate = Date.now();

    firebase.database().ref('users/' + userId + '/entries/' + currentDate).set({
      name: name.value,
      reason: reason.value,
      date: date.value,
      sum: sum.value,
      timestamp: currentDate
    }, (error) => {
      if (error) {
        // The write failed...
      } else {
        document.getElementById('addFDB').textContent = "Eintrag wurde erfolgreich erstellt."
      }
    });
    printEntries(userId);

    homeIcon.click();

    name.value = '';
    reason.value = '';
    sum.value = '';
    initDateValue();
  });

  function writeUserToDatabase(username, email, userId) {
    firebase.database().ref('users/' + userId + '/userdata').set({
      username: username,
      email: email
    }, (error) => {
      if (error) {
        // The write failed...
      } else {
        // Data saved successfully!
      }
    });
  }

  function printEntries(userId) {
    let content;
    let entries = [];

    const patternWrapper = document.getElementById('entryWrapper');
    while (patternWrapper.firstChild) patternWrapper.removeChild(patternWrapper.firstChild);

    firebase.database().ref('users/' + userId + '/entries').once('value').then((snapshot) => {

      content = snapshot.val();

      // Fill Array with Database Content
      for (let index in content) {
        entries[entries.length] = content[index];
      }

      // Sort Array by timestamp
      // for (let i = 0; i < entries.length; i++) {
      //   for (let j = i + 1; j < entries.length; j++) {
      //     if (entries[i].startTimestamp > entries[j].startTimestamp) {
      //       let help = entries[j];
      //       entries[j] = entries[i];
      //       entries[i] = help;
      //     }
      //   }
      // }

      // Convert Date Format
      for (let i = 0; i < entries.length; i++) {
        let parts = entries[i].date.split('-');
        let tempYear = parts[0];
        let tempMonth = parts[1];
        let tempDay = parts[2];

        entries[i].date = `${tempDay}.${tempMonth}.${tempYear}`;
      }

      for (let i = 0; i < entries.length; i++) {
        let date = 'Datum: ' + entries[i].date;
        let sum = 'Betrag: ' + entries[i].sum + '€';
        let name = 'Schuldner: ' + entries[i].name;
        let reason = 'Grund: ' + entries[i].reason;
        let timestamp = entries[i].timestamp;

        let contentWrapper = document.getElementById('entryWrapper');
        let newEintrag = document.createElement('div');

        newEintrag.classList.add('eintrag');

        let dateBox = document.createElement('div');
        let sumBox = document.createElement('div');
        let nameBox = document.createElement('div');
        let reasonBox = document.createElement('div');
        let removeBox = document.createElement('i');

        let eintragData = [name, date, reason, sum];
        let outputArr = [nameBox, dateBox, reasonBox, sumBox];

        for (let i = 0; i < outputArr.length; i++) {
          setTimeout(() => {
            outputArr[i].textContent = eintragData[i];
            newEintrag.appendChild(outputArr[i]);
          }, 250);
        }
        removeBox.classList.add('fas');
        removeBox.classList.add('fa-times');
        removeBox.addEventListener('click', () => {
          firebase.database().ref('users/' + userId + '/entries/' + timestamp).remove();
          contentWrapper.removeChild(newEintrag);
          if (contentWrapper.childNodes.length === 0) document.getElementById('entryFDB').textContent = 'Keine Einträge verfügbar.'
        });
        newEintrag.appendChild(removeBox)
        contentWrapper.appendChild(newEintrag);
      }
    });
    document.getElementById('entryFDB').textContent = '';
  }
});

function changeDisplayProperty(id, property) {
  document.getElementById(id).style.display = property;
}

function fadeOut(id) {
  document.getElementById(id).style.opacity = 0;
}

function fadeIn(id) {
  document.getElementById(id).style.opacity = 1;
}

function initDateValue() {
  const currentDate = new Date();
  const date = document.getElementById('date');
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  let dateChanged = false;
  let month;
  let day;

  if (currentMonth < 10) {
    month = `0${currentMonth}`;
    dateChanged = true;
  } else {
    month = currentMonth;
  }

  if (currentDay < 10) {
    day = `0${currentDay}`;
    dateChanged = true;
  } else {
    day = currentDay;
  }

  if (dateChanged) {
    date.value = `${currentYear}-${month}-${day}`;
  } else {
    date.value = `0${currentYear}-${month}-${day}`;
  }
}
