window.addEventListener('load', () => {

  const config = {
    apiKey: 'AIzaSyDW8BFHDpNA2C80hYDlF-iSVpawHeek_Mo',
    authDomain: 'schulden-verwaltung.firebaseapp.com',
    databaseURL: 'https://schulden-verwaltung.firebaseio.com',
    projectId: 'schulden-verwaltung',
    storageBucket: 'schulden-verwaltung.appspot.com',
    messagingSenderId: '348756034907',
    appId: '1:348756034907:web:d68eba86f4d6bb8a'
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

    document.getElementById('addFDB').textContent = document.getElementById('addFDB').textContent.replace('Eintrag wurde erfolgreich erstellt.', '');

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
      if (entryWrapper.childNodes.length === 0) document.getElementById('entryFDB').textContent = 'Keine Einträge verfügbar.'
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
    let invalid = false;

    printErrorMessage(signUpFDB, '');

    toggleSignUpAnimation();

    if (email.value === '') {
      invalid = true;
      printErrorMessage(signUpFDB, 'Es dürfen keine Felder leer bleiben.');
      emailInvalid = true;
    } else {
      emailInvalid = false;
      invalid = false;
    }

    if (password.value === '') {
      invalid = true;
      printErrorMessage(signUpFDB, 'Es dürfen keine Felder leer bleiben.');
      pwInvalid = true;
    } else {
      pwInvalid = false;
      invalid = false;
    }

    if (username.value === '') {
      invalid = true;
      printErrorMessage(signUpFDB, 'Es dürfen keine Felder leer bleiben.');
      userInvalid = true;
    } else {
      userInvalid = false;
      invalid = false;
    }

    if (!emailInvalid && !pwInvalid && !userInvalid) {
      if (email.value.includes('@')) {
        if (!validateEmail(email)) {
          printErrorMessage(signUpFDB, 'Die eingegebene E-Mail Adresse ist ungültig.');
          emailInvalid = true;
        } else if (!validatePassword(password)) {
          printErrorMessage(signUpFDB, 'Das eingegebene Passwort ist ungültig.');
          pwInvalid = true;
        }
      } else {
        printErrorMessage(signUpFDB, 'Die eingegebene E-Mail Adresse ist ungültig.');
        emailInvalid = true;
      }
    }

    if (emailInvalid) {
      email.style.borderBottom = 'red 5px solid';
      email.removeEventListener('focus', () => {
        email.style.borderBottom = 'lightgray 5px solid';
      });
    } else {
      email.style.borderBottom = 'lightgray 5px solid';
      email.addEventListener('focus', () => {
        email.style.borderBottom = '#5ac878 5px solid';
      });

      email.addEventListener('blur', () => {
        email.style.borderBottom = 'lightgray 5px solid';
      });
    }

    if (pwInvalid) {
      password.style.borderBottom = 'red 5px solid';
      password.removeEventListener('focus', () => {
        password.style.borderBottom = 'lightgray 5px solid';
      });
    } else {
      password.style.borderBottom = 'lightgray 5px solid';
      password.addEventListener('focus', () => {
        password.style.borderBottom = '#5ac878 5px solid';
      });

      password.addEventListener('blur', () => {
        password.style.borderBottom = 'lightgray 5px solid';
      });
    }

    if (userInvalid) {
      username.style.borderBottom = 'red 5px solid';
      username.removeEventListener('focus', () => {
        username.style.borderBottom = 'lightgray 5px solid';
      });
    } else {
      username.style.borderBottom = 'lightgray 5px solid';
      username.addEventListener('focus', () => {
        username.style.borderBottom = '#5ac878 5px solid';
      });

      username.addEventListener('blur', () => {
        username.style.borderBottom = 'lightgray 5px solid';
      });
    }

    signUpFDB.style.color = 'red';

    if (signUpFDB.textContent !== '') {
      toggleSignUpAnimation();
    }

    if (!emailInvalid && !pwInvalid && !userInvalid) {
      const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
          promise.catch((error) => {
            if (error.message === 'The email address is already in use by another account.') {
              printErrorMessage(signUpFDB, 'Die eingegebene E-Mail Adresse wurde bereits verwendet.');
              toggleSignUpAnimation();
              email.style.borderBottom = 'red 5px solid';
              email.removeEventListener('focus', () => {
                email.style.borderBottom = 'lightgray 5px solid';
              });
            }
          });

          promise.then(() => {
            const userId = firebase.auth().currentUser.uid;
            writeUserToDatabase(username.value, email.value, userId);
            homeIcon.click();
            toggleSignUpAnimation();
          });
    }
  });

  signInBtn.addEventListener('click', () => {
    const email = document.getElementById('emailSignIn');
    const password = document.getElementById('passwordSignIn');
    const auth = firebase.auth();

    toggleSignInAnimation();

    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
        promise.catch((error) => {
          toggleSignInAnimation();
          signInErrorHandling(email, password, error);
        });

        promise.then(() => {
          homeIcon.click();
          toggleSignInAnimation();
        });
  });

  addEntryBtn.addEventListener('click', () => {
    const name = document.getElementById('name');
    const reason = document.getElementById('reason');
    const date = document.getElementById('date');
    const sum = document.getElementById('sum');
    const addFDB = document.getElementById('addFDB');
    const userId = firebase.auth().currentUser.uid;
    const currentDate = Date.now();
    let isNameValid = true;
    let isReasonValid = true;
    let isSumValid = true;

    toggleAddEntryAnimation();

    document.getElementById('addFDB').textContent = '';

    if (name.value === '') {
      isNameValid = false;
      name.style.borderBottom = 'red 5px solid';
      name.removeEventListener('focus', () => {
        name.style.borderBottom = 'lightgray 5px solid';
      });
    } else {
      name.style.borderBottom = 'lightgray 5px solid';
      name.addEventListener('focus', () => {
        name.style.borderBottom = '#5ac878 5px solid';
      });

      name.addEventListener('blur', () => {
        name.style.borderBottom = 'lightgray 5px solid';
      });

      isNameValid = true;
    }

    if (reason.value === '') {
      isReasonValid = false;
      reason.style.borderBottom = 'red 5px solid';
      reason.removeEventListener('focus', () => {
        reason.style.borderBottom = 'lightgray 5px solid';
      });
    } else {
      reason.style.borderBottom = 'lightgray 5px solid';
      reason.addEventListener('focus', () => {
        reason.style.borderBottom = '#5ac878 5px solid';
      });

      reason.addEventListener('blur', () => {
        reason.style.borderBottom = 'lightgray 5px solid';
      });

      isReasonValid = true;
    }

    if (sum.value === '') {
      isSumValid = false;
      sum.style.borderBottom = 'red 5px solid';
      sum.removeEventListener('focus', () => {
        sum.style.borderBottom = 'lightgray 5px solid';
      });
    } else {
      sum.style.borderBottom = 'lightgray 5px solid';
      sum.addEventListener('focus', () => {
        sum.style.borderBottom = '#5ac878 5px solid';
      });

      sum.addEventListener('blur', () => {
        sum.style.borderBottom = 'lightgray 5px solid';
      });

      isSumValid = true;
    }

    if (isNameValid && isReasonValid && isSumValid) {
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
          addFDB.style.color = 'black';
          addFDB.textContent = 'Eintrag wurde erfolgreich erstellt.';
          homeIcon.click();
          printEntries(userId);
          name.value = '';
          reason.value = '';
          sum.value = '';
          initDateValue();
          toggleAddEntryAnimation();
        }
      });
    } else {
      printErrorMessage(addFDB, 'Es dürfen keine Felder leer bleiben.');
      toggleAddEntryAnimation();
    }
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
      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          if (entries[i].timestamp > entries[j].timestamp) {
            let help = entries[j];
            entries[j] = entries[i];
            entries[i] = help;
          }
        }
      }

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
        entries[i].sum = entries[i].sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        entries[i].sum = entries[i].sum.replace('.', ',');
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
          else document.getElementById('entryFDB').textContent = '';
        });
        newEintrag.appendChild(removeBox)
        contentWrapper.appendChild(newEintrag);

        if (contentWrapper.childNodes.length === 0) document.getElementById('entryFDB').textContent = 'Keine Einträge verfügbar.'
        else document.getElementById('entryFDB').textContent = '';
      }
    });
    document.getElementById('entryFDB').textContent = '';
  }

  function toggleSignInAnimation() {
    const signInLoader = document.getElementById('signInLoader')
    const elements = signInLoader.getElementsByTagName('div');
    const text = document.getElementById('signInText');

    text.classList.toggle('hide');
    signInLoader.classList.toggle('hide');

    elements[0].classList.toggle('animate');

    setTimeout(() => {
      elements[1].classList.toggle('animate');
    }, 250);

    setTimeout(() => {
      elements[2].classList.toggle('animate');
    }, 500);

  }

  function toggleSignUpAnimation() {
    const signUpLoader = document.getElementById('signUpLoader')
    const elements = signUpLoader.getElementsByTagName('div');
    const text = document.getElementById('signUpText');

    text.classList.toggle('hide');
    signUpLoader.classList.toggle('hide');

    elements[0].classList.toggle('animate');

    setTimeout(() => {
      elements[1].classList.toggle('animate');
    }, 250);

    setTimeout(() => {
      elements[2].classList.toggle('animate');
    }, 500);

  }

  function toggleAddEntryAnimation() {
    const addEntryLoader = document.getElementById('addEntryLoader')
    const elements = addEntryLoader.getElementsByTagName('div');
    const text = document.getElementById('signUpText');

    text.classList.toggle('hide');
    signUpLoader.classList.toggle('hide');

    elements[0].classList.toggle('animate');

    setTimeout(() => {
      elements[1].classList.toggle('animate');
    }, 250);

    setTimeout(() => {
      elements[2].classList.toggle('animate');
    }, 500);

  }

  function signInErrorHandling(email, password, error) {
    let empty = false;
    let emailInvalid = false;
    let pwInvalid = false;
    const errorMsg = error.message;

    const messages = ['The password is invalid or the user does not have a password.',
                      'The email address is badly formatted.',
                      'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later'
                     ]

    if (email.value === '') {
      empty = true;
      signInFDB.textContent = 'Es dürfen keine Felder leer bleiben.'
      emailInvalid = true;
    } else {
      emailInvalid = false;
    }

    if (password.value === '') {
      empty = true;
      signInFDB.textContent = 'Es dürfen keine Felder leer bleiben.'
      pwInvalid = true;
    }

    if (!empty) {
      if (errorMsg === messages[0]) {
        signInFDB.textContent = 'Das eingegebene Passwort ist ungültig.';
        pwInvalid = true;
      }

      if (errorMsg === messages[1]) {
        signInFDB.textContent = 'Die eingegebene E-Mail Adresse ist ungültig.';
        emailInvalid = true;
      }

      if (errorMsg === messages[2]) {
        signInFDB.textContent = 'Der Anmelde Vorgang ist zu oft fehlgeschlagen, versuchen Sie es später ernuet.';
      }
    }

    if (emailInvalid) {
      email.style.borderBottom = 'red 5px solid';
      email.removeEventListener('focus', () => {
        email.style.borderBottom = '#5ac878 5px solid';
      });
    } else {
      email.style.borderBottom = 'lightgray 5px solid';
      email.addEventListener('focus', () => {
        email.style.borderBottom = '#5ac878 5px solid';
      });

      email.addEventListener('blur', () => {
        email.style.borderBottom = 'lightgray 5px solid';
      });
    }

    if (pwInvalid) {
      password.style.borderBottom = 'red 5px solid';
      password.removeEventListener('focus', () => {
        password.style.borderBottom = 'lightgray 5px solid';
      });
    } else {
      password.style.borderBottom = 'lightgray 5px solid';
      password.addEventListener('focus', () => {
        password.style.borderBottom = '#5ac878 5px solid';
      });

      password.addEventListener('blur', () => {
        password.style.borderBottom = 'lightgray 5px solid';
      });
    }

    signInFDB.style.color = 'red';
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

function printErrorMessage(elm, msg) {
  elm.textContent = msg;
  elm.style.color = 'red';
}

function validatePassword(password) {
  return /[a-z]/.test(password.value) && /[A-Z]/.test(password.value) && /[0-9]/.test(password.value) && password.value.length > 5;
}

function validateEmail(email) {
  const splitEmail = email.value.split('@');
  return splitEmail.length === 2 && splitEmail[1].split('.').length === 2 && splitEmail[1].split('.')[1].length >= 2;
}
