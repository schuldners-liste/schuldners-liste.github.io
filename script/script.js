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

  firebase.auth().languageCode = 'de';

  const userIcon = document.getElementById('user');
  const homeIcon = document.getElementById('home');
  const plusIcon = document.getElementById('plus');
  const signOutIcon = document.getElementById('signOut');
  const gotToSignUp = document.getElementById('goToSignUp');
  const gotToSignIn = document.getElementById('goToSignIn');
  const signUpBtn = document.getElementById('signUpBtn');
  const signInBtn = document.getElementById('signInBtn');
  const addEntryBtn = document.getElementById('addEntryBtn');
  const navBurger = document.getElementById('navBurger');
  const info = document.getElementById('info');
  const security = document.getElementById('security');
  const deleted = document.getElementById('deleted');
  const support = document.getElementById('support');
  // const settings = document.getElementById('settings');
  const konto = document.getElementById('konto');
  const disableNav = document.getElementById('disableNav');

  userIcon.addEventListener('click', () => {

    const inputs = [document.getElementById('emailSignUp'),
                    document.getElementById('usernameSignUp'),
                    document.getElementById('passwordSignUp'),
                    document.getElementById('emailSignIn'),
                    document.getElementById('passwordSignIn')];

    for (const input of inputs) {
      input.value = '';
    }

    hideAll();



    // setTimeout(function () {
      changeDisplayProperty('accountWrapper', 'block');
    // }, 200);
  });

  homeIcon.addEventListener('click', () => {
    hideAll();
    changeDisplayProperty('contentWrapper', 'block');
  });

  plusIcon.addEventListener('click', () => {
    hideAll();
    initDateValue();
    changeDisplayProperty('plusWrapper', 'block');
  });

  signOutIcon.addEventListener('click', () => {
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      printEntries(user.uid);

      changeDisplayProperty('user', 'none');
      changeDisplayProperty('signOut', 'block');
      changeDisplayProperty('addWrapper', 'block');

      document.getElementById('addFDB').textContent = '';

      if (entryWrapper.childNodes.length === 0) document.getElementById('entryFDB').textContent = 'Keine Einträge verfügbar.';
      if (deletedEntriesWrapper.childNodes.length === 0) document.getElementById('deletedFDB').textContent = 'Keine Einträge verfügbar.';

      firebase.database().ref('users/' + user.uid + '/userdata').once('value').then((snapshot) => {
        document.getElementById('usernameField').textContent = snapshot.val().username;
      });
    } else {
      changeDisplayProperty('user', 'block');
      changeDisplayProperty('signOut', 'none');

      const patternWrapper = document.getElementById('entryWrapper');
      while (patternWrapper.firstChild) patternWrapper.removeChild(patternWrapper.firstChild);

      document.getElementById('entryFDB').textContent = 'Keine Einträge verfügbar.';
      document.getElementById('addFDB').textContent = 'Sie müssen angemeldet sein um Einträge erstellen zu können.';
      document.getElementById('usernameField').textContent = 'nicht eingeloggt.';

      changeDisplayProperty('addWrapper', 'none');
    }
  });

  gotToSignUp.addEventListener('click', () => {
    hideAll();
    changeDisplayProperty('signUp', 'block');
    changeDisplayProperty('accountWrapper', 'block');
    changeDisplayProperty('signIn', 'none');
  });

  gotToSignIn.addEventListener('click', () => {
    hideAll();
    changeDisplayProperty('signIn', 'block');
    changeDisplayProperty('accountWrapper', 'block');
    changeDisplayProperty('signUp', 'none');
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
    } else if (sum.value <= 0) {
      printErrorMessage(addFDB, 'Ungültiger Betrag.');
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

  navBurger.addEventListener('click', () => {
    const b1 = document.getElementById('burger1');
    const b2 = document.getElementById('burger2');
    const b3 = document.getElementById('burger3');
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const disableNav = document.getElementById('disableNav');

    b1.classList.toggle('burger1Active');
    b2.classList.toggle('burger2Active');
    b3.classList.toggle('burger3Active');

    if (nav.style.left === '0px') {
      nav.style.left = '-90vw';
      burger.style.left = 0;
      disableNav.style.display = 'none';
    } else {
      nav.style.left = 0;
      burger.style.left = '82vw';
      disableNav.style.display = 'block';
    }
  });

  disableNav.addEventListener('click', () => {
    if (document.getElementById('nav').style.left === '0px') {
      navBurger.click();
    }
  });

  info.addEventListener('click', () => {
    hideAll();
    changeDisplayProperty('infoWrapper', 'block');

    navBurger.click();
  });

  security.addEventListener('click', () => {
    hideAll();
    changeDisplayProperty('securityWrapper', 'block');

    navBurger.click();
  });

  deleted.addEventListener('click', () => {
    const deletedFDB = document.getElementById('deletedFDB');
    hideAll();
    changeDisplayProperty('deletedWrapper', 'block');

    navBurger.click();

    if (firebase.auth().currentUser !== null) {
      printDeletedEntries(firebase.auth().currentUser.uid);
    } else {
      deletedFDB.textContent = 'Sie müssen eingeloggt sein um diese Funktion nutzen zu können.';
    }
  });

  support.addEventListener('click', () => {
    hideAll();
    changeDisplayProperty('supportWrapper', 'block');

    navBurger.click();
  });

  // settings.addEventListener('click', () => {
  //   hideAll();
  //   changeDisplayProperty('settingsWrapper', 'block');
  //
  //   navBurger.click();
  // });

  konto.addEventListener('click', () => {
    hideAll();
    changeDisplayProperty('kontoWrapper', 'block');

    const changeUsername = document.getElementById('changeUNBtn');
    const changeEmail = document.getElementById('changeEMpBtn');
    const changePassword = document.getElementById('changePWBtn');
    const deleteAccBtn = document.getElementById('deleteAccBtn')
    const user = firebase.auth().currentUser;

    clearValues();

    changeUsername.addEventListener('click', () => {
      toggleChangeUserNameAnimation();
      const newUsername = document.getElementById('newUsername');
      const password = document.getElementById('usernamePW');
      const changeUsernameFDB = document.getElementById('changeUsernameFDB');
      let isValid = true;

      if (newUsername.value === '') {
        newUsername.style.borderBottom = 'red 5px solid';
        changeUsernameFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (password.value === '') {
        password.style.borderBottom = 'red 5px solid';
        changeUsernameFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (isValid) {
        user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, password.value)).then(() => {
          firebase.database().ref('users/' + user.uid + '/userdata').update({
            username: newUsername.value
          }, (error) => {
            if (error) {
              console.log(error.message);
              toggleChangeUserNameAnimation();
            } else {
              toggleChangeUserNameAnimation();
            }
          });
        });

      } else {
        toggleChangeUserNameAnimation();
      }

    });

    changeEmail.addEventListener('click', () => {
      togglechangeEmailAnimation();
      const newEmail = document.getElementById('newEmail');
      const password = document.getElementById('emailPW');
      const changeEmailFDB = document.getElementById('changeEmailFDB');
      let isValid = true;

      if (newEmail.value === '') {
        newEmail.style.borderBottom = 'red 5px solid';
        changeEmailFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (password.value === '') {
        password.style.borderBottom = 'red 5px solid';
        changeEmailFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (isValid) {
        user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, password.value)).then(() => {
          firebase.database().ref('users/' + user.uid + '/userdata').update({
            email: newEmail.value
          }, (error) => {
            if (error) {
              console.log(error.message);
              togglechangeEmailAnimation();
            } else {
              togglechangeEmailAnimation();
            }

            user.updateEmail(newEmail.value).then(() => {
              console.log('success');
            });
          });
        });

      } else {
        togglechangeEmailAnimation();
      }

    });

    changePassword.addEventListener('click', () => {
      togglechangePasswordAnimation();
      const oldPassword = document.getElementById('oldPW');
      const newPassword = document.getElementById('newPW');
      const confirmNewPW = document.getElementById('confirmNewPW');
      const changePWFDB = document.getElementById('changePWFDB');
      let isValid = true;

      if (oldPassword.value === '') {
        oldPassword.style.borderBottom = 'red 5px solid';
        changePWFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (newPassword.value === '') {
        newPassword.style.borderBottom = 'red 5px solid';
        changePWFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (confirmNewPW.value === '') {
        confirmNewPW.style.borderBottom = 'red 5px solid';
        changePWFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (!validatePassword(newPassword)) {
        newPassword.style.borderBottom = 'red 5px solid';
        changePWFDB.textContent = 'Ungültiges Passwort.';
        isValid = false;
      } else if (confirmNewPW.value !== newPassword.value) {
        confirmNewPW.style.borderBottom = 'red 5px solid';
        newPassword.style.borderBottom = 'red 5px solid';
        changePWFDB.textContent = 'E-Mail Adressen stimmen nicht überein.';
        isValid = false;
      } else if (oldPassword.value === newPassword.value) {
        oldPassword.style.borderBottom = 'red 5px solid';
        newPassword.style.borderBottom = 'red 5px solid';
        changePWFDB.textContent = 'Die neue und alte E-Mail Adresse dürfen nicht gleich sein.';
        isValid = false;
      }

      if (isValid) {
        user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, oldPassword.value)).then(() => {
          user.updatePassword(newPassword.value).then(() => {
            console.log('success');
            togglechangePasswordAnimation();
          });
        });
      } else {
        togglechangePasswordAnimation();
      }
    });

    deleteAccBtn.addEventListener('click', () => {
      const deleteAccPopUp = document.getElementById('deleteAccPopUp');

      const password = document.getElementById('deleteAccPW');
      const deleteFDB = document.getElementById('deleteFDB');
      const deleteAccPopUpBtn = document.getElementById('deleteAccPopUpBtn');
      let isValid = true;

      if (password.value === '') {
        password.style.borderBottom = 'red 5px solid';
        deleteFDB.textContent = 'Es dürfen keine Felder leer bleiben';
        isValid = false;
      }

      if (isValid) {
        user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, password.value)).then(() => {
          deleteAccPopUp.style.display = 'block';

          deleteAccPopUpBtn.addEventListener('click', () => {
              user.delete().then(() => {
                  console.log('success');
              });

              firebase.database().ref('users/' + user.uid + '/userdata').remove().then(() => {
                console.log('successfully deleted');
              });
          });
        });
      }

    });

    navBurger.click();
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
        if (entries[i].date.includes('-')) {
          let parts = entries[i].date.split('-');
          let tempYear = parts[0];
          let tempMonth = parts[1];
          let tempDay = parts[2];

          entries[i].date = `${tempDay}.${tempMonth}.${tempYear}`;
        }
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
          moveEntry(userId, entries[i]);
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

  function printDeletedEntries(userId) {
    let content;
    let entries = [];

    const wrapper = document.getElementById('deletedEntriesWrapper');
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);

    firebase.database().ref('users/' + userId + '/deletedEntries').once('value').then((snapshot) => {

      content = snapshot.val();

      // Fill Array with Database Content
      for (let index in content) {
        entries[entries.length] = content[index];
      }

      for (let i = 0; i < entries.length; i++) {
        let date = 'Datum: ' + entries[i].date;
        entries[i].sum = entries[i].sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        entries[i].sum = entries[i].sum.replace('.', ',');
        let sum = 'Betrag: ' + entries[i].sum + '€';
        let name = 'Schuldner: ' + entries[i].name;
        let reason = 'Grund: ' + entries[i].reason;
        let delDate = 'Gelöscht am: ' + entries[i].delDate + ', ' + entries[i].delTime + 'Uhr';

        let contentWrapper = document.getElementById('deletedEntriesWrapper');
        let newEintrag = document.createElement('div');

        newEintrag.classList.add('eintrag');

        let dateBox = document.createElement('div');
        let sumBox = document.createElement('div');
        let nameBox = document.createElement('div');
        let reasonBox = document.createElement('div');
        let delBox = document.createElement('div');
        let redo = document.createElement('i');

        let eintragData = [name, date, reason, sum, delDate];
        let outputArr = [nameBox, dateBox, reasonBox, sumBox, delBox];

        for (let i = 0; i < outputArr.length; i++) {
          setTimeout(() => {
            outputArr[i].textContent = eintragData[i];
            newEintrag.appendChild(outputArr[i]);
          }, 250);
        }

        redo.classList.add('fas');
        redo.classList.add('fa-redo-alt');
        redo.addEventListener('click', () => {
          firebase.database().ref('users/' + userId + '/deletedEntries/' + entries[i].timestamp).remove();
          contentWrapper.removeChild(newEintrag);
          moveDeletedEntriesToMainList(userId, entries[i]);
        });
        newEintrag.appendChild(redo);
        contentWrapper.appendChild(newEintrag);

        if (contentWrapper.childNodes.length === 0) document.getElementById('deletedFDB').textContent = 'Keine gelöschten Einträge verfügbar.'
        else document.getElementById('deletedFDB').textContent = '';
      }
    });
    document.getElementById('deletedFDB').textContent = '';
  }

  function moveDeletedEntriesToMainList(userId, entry) {

    const currentTime = new Date();

    firebase.database().ref('users/' + userId + '/entries/' + currentTime.getTime()).set({
      name: entry.name,
      sum: entry.sum,
      reason: entry.reason,
      date: entry.date,
      timestamp: currentTime.getTime()
    }, (error) => {
      if (error) {
        // The write failed...
      } else {
        printEntries(userId);
      }
    });
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

  function toggleChangeUserNameAnimation() {
    const changeUNLoader = document.getElementById('changeUNLoader')
    const elements = changeUNLoader.getElementsByTagName('div');
    const text = document.getElementById('changeUNText');

    text.classList.toggle('hide');
    changeUNLoader.classList.toggle('hide');

    elements[0].classList.toggle('animate');

    setTimeout(() => {
      elements[1].classList.toggle('animate');
    }, 250);

    setTimeout(() => {
      elements[2].classList.toggle('animate');
    }, 500);

  }

  function togglechangeEmailAnimation() {
    const loaderBox = document.getElementById('changeEMLoader')
    const elements = loaderBox.getElementsByTagName('div');
    const text = document.getElementById('changeEMText');

    text.classList.toggle('hide');
    loaderBox.classList.toggle('hide');

    elements[0].classList.toggle('animate');

    setTimeout(() => {
      elements[1].classList.toggle('animate');
    }, 250);

    setTimeout(() => {
      elements[2].classList.toggle('animate');
    }, 500);

  }

  function togglechangePasswordAnimation() {
    const changePWLoader = document.getElementById('changePWLoader')
    const elements = changePWLoader.getElementsByTagName('div');
    const text = document.getElementById('changePWText');

    text.classList.toggle('hide');
    changePWLoader.classList.toggle('hide');

    elements[0].classList.toggle('animate');

    setTimeout(() => {
      elements[1].classList.toggle('animate');
    }, 250);

    setTimeout(() => {
      elements[2].classList.toggle('animate');
    }, 500);

  }

  function toggledeleteAccAnimation() {
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
                      'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later',
                      'There is no user record corresponding to this identifier. The user may have been deleted.'
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

      if (errorMsg === messages[3]) {
        signInFDB.textContent = 'Es wurde keine Account mit der eingegebenen E-Mail Adresse gefunden.';
        emailInvalid = true;
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

  function moveEntry(userId, entry) {

    let deleteDate = new Date();
    const delDate = `${deleteDate.getDate()}.${deleteDate.getMonth()+1}.${deleteDate.getFullYear()}`;
    const delTime = `${deleteDate.getHours()}:${deleteDate.getMinutes()}`;

    firebase.database().ref('users/' + userId + '/deletedEntries/' + deleteDate.getTime()).set({
      name: entry.name,
      sum: entry.sum,
      reason: entry.reason,
      date: entry.date,
      delDate: delDate,
      delTime: delTime,
      timestamp: deleteDate.getTime()
    }, (error) => {
      if (error) {
        // The write failed...
      } else {
        // Data saved successfully!
      }
    });
  }

  function clearValues() {
    const elements = [document.getElementById('deleteAccPW'),
                      document.getElementById('oldPW'),
                      document.getElementById('newPW'),
                      document.getElementById('confirmNewPW'),
                      document.getElementById('newEmail'),
                      document.getElementById('emailPW'),
                      document.getElementById('newUsername'),
                      document.getElementById('usernamePW'),
                      document.getElementById('changeUsernameFDB'),
                      document.getElementById('changeEmailFDB'),
                      document.getElementById('changePWFDB'),
                      document.getElementById('deleteFDB')
                     ]
    const elementArray = Array.from(elements);

    elementArray.forEach((item) => {
      if (item.id.includes('FDB')) {
        item.textContent = '';
      } else {
        item.value = '';
      }
    });
  }
});

function changeDisplayProperty(id, property) {
  document.getElementById(id).style.display = property;
}

function hideAll() {

  const elements = [document.getElementById('contentWrapper'),
                    document.getElementById('accountWrapper'),
                    document.getElementById('plusWrapper'),
                    document.getElementById('infoWrapper'),
                    document.getElementById('securityWrapper'),
                    document.getElementById('deletedWrapper'),
                    document.getElementById('supportWrapper'),
                    // document.getElementById('settingsWrapper'),
                    document.getElementById('kontoWrapper')
                  ];

  for (const element of elements) {
    element.style.display = 'none';
  }
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
