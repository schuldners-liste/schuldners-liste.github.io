let previousTheme = {};

function printThemes(themes, isFirstTime) {
    const contentWrapper = document.getElementById('selectThemes');
    let i = 0;

    for (const theme of themes) {
        let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3284 1833.35"><path class="cls-1" style="fill: placeholder1" d="M1140.94,684c-155.16,499.63-933.06,460.5-957.35,718.72-21.26,226,539.19,631.7,957.35,480.19,427.3-154.82,421.09-580.76,802-705.76,504-165.41,934.55,597.07,1280.14,424.7,279.41-139.36,343-950.26,63.12-1168.83C2939.09,162,2263.86,957.77,1690.87,624.86,1450.31,485.1,1317.13,198.29,1213.63,251.5,1131.39,293.78,1204.06,480.73,1140.94,684Z" transform="translate(-183 -163.65)"/><path class="cls-2" style="fill: placeholder2; opacity: .6" d="M1601.2,1435.31c-635.61-475-935.69-428.72-1123.69-839.6-60.72-132.72-126.44-351-56.06-419.56C528.64,71.7,935.75,657.07,1465.77,626,1907.54,600.06,1997,165.07,2495.43,181.43c68.67,2.26,379.11,12.45,559.5,257.21,116.19,157.65,121.1,334.85,126.24,520.63,2.28,82.27,15.63,844.76-360.46,1011.58-48.61,21.57-137.42,48.12-347.28-4.53C2097.42,1872,1914.23,1669.23,1601.2,1435.31Z" transform="translate(-183 -163.65)"/></svg>';
        let id = getThemeId(theme);
        const bannerWrapper = document.createElement('div');
        const colorWrapper = document.createElement('div');
        const iconWrapper = document.createElement('div');
        const newTheme = document.createElement('div');
        const defaultView = document.createElement('div');
        const touchHoldView = document.createElement('div');

        svg = svg.replace('placeholder1', theme.hex);
        svg = svg.replace('placeholder2', theme.hex2);
        bannerWrapper.innerHTML += svg;

        newTheme.hex = theme.hex;
        newTheme.hex2 = theme.hex2;
        newTheme.color = theme.color;

        for (let i = 0; i < 2; i++) {
            const newColor = document.createElement('div');
            i % 2 === 0 ? newColor.style.background = theme.hex : newColor.style.background = theme.hex2;
            colorWrapper.appendChild(newColor);
        }

        let icon = document.createElement('i');
        icon.setAttribute('class', 'far fa-check-circle');
        icon.setAttribute('id', `icon${id}`);
        iconWrapper.appendChild(icon);

        if (theme.isCustom) {
            const editWrapper = document.createElement('div');
            const deleteWrapper = document.createElement('div');
            const cancelWrapper = document.createElement('div');

            // edit Wrapper elements
            let text = document.createElement('h3');
            text.textContent = 'Bearbeiten';
            icon = document.createElement('i');
            icon.setAttribute('class', 'fas fa-edit');

            editWrapper.appendChild(text);
            editWrapper.appendChild(icon);
            
            // delete Wrapper elements
            text = document.createElement('h3');
            text.textContent = 'Löschen';
            icon = document.createElement('i');
            icon.setAttribute('class', 'fas fa-trash-alt');

            deleteWrapper.appendChild(text);
            deleteWrapper.appendChild(icon);
            
            // cancel Wrapper elements
            text = document.createElement('h3');
            text.textContent = 'Abbrechen';
            icon = document.createElement('i');
            icon.setAttribute('class', 'fas fa-times');

            cancelWrapper.appendChild(text);
            cancelWrapper.appendChild(icon);

            let timer;
            let duration = 500;
            let touchHold;

            newTheme.addEventListener('touchstart', () => {
                timer = setTimeout(touchHold, duration);
            });

            newTheme.addEventListener('touchend', () => {
                if (timer)
                clearTimeout(timer);
            });

            touchHold = () => {            
                cancelWrapper.click();
            }

            editWrapper.addEventListener('click', () => {
                const customThemeWrapper = document.getElementById('customThemeWrapper');
                document.getElementById('themeOverview').style.left = '-100vw';
                customThemeWrapper.style.left = 0;

                const primaryColorPicker = document.getElementById('primaryColorPicker');
                const secondaryColorPicker = document.getElementById('secondaryColorPicker');
                const textColorPicker = document.getElementById('textColorPicker');
                const svg = document.getElementById('customThemeSvg');

                primaryColorPicker.value = newTheme.hex;
                secondaryColorPicker.value = newTheme.hex2;
                textColorPicker.value = newTheme.color;

                svg.getElementsByTagName('path')[0].style.fill = primaryColorPicker.value;
                svg.getElementsByTagName('path')[1].style.fill = secondaryColorPicker.value;

                previousTheme = {hex: newTheme.hex, hex2: newTheme.hex2, color: newTheme.color};
                document.getElementById('customThemeSaveBtn').classList.add('hide');
                document.getElementById('customThemeUpdateBtn').classList.remove('hide');

                changeHeadline('Theme bearbeiten');

                setTimeout(() => {
                    cancelWrapper.click();
                }, 210);
            });

            deleteWrapper.addEventListener('click', () => {
                sessionStorage.setItem('buttonClicked', true);

                id = getThemeId(newTheme);

                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/customThemes/${id}`).remove().then(() => {
                    if (document.getElementById(`icon${id}`).className.includes('active')) {
                        sessionStorage.setItem('buttonClicked', false);
                        document.getElementsByClassName('defaultTheme')[0].click();
                        sessionStorage.setItem('buttonClicked', true);
                    }
                    
                    contentWrapper.removeChild(newTheme);
    
                    setTimeout(() => {
                        sessionStorage.setItem('buttonClicked', false);
                    }, 50);
                });
            });

            cancelWrapper.addEventListener('click', () => {
                sessionStorage.setItem('buttonClicked', true);
                defaultView.classList.toggle('hide');
                touchHoldView.classList.toggle('hide');
                
                setTimeout(() => {
                    sessionStorage.setItem('buttonClicked', false);
                }, 50);
            });

            touchHoldView.appendChild(editWrapper);
            touchHoldView.appendChild(deleteWrapper);
            touchHoldView.appendChild(cancelWrapper);
        }

        touchHoldView.classList.add('hide');
        touchHoldView.classList.add('touchHoldView');
        bannerWrapper.classList.add('bannerWrapper');
        colorWrapper.classList.add('colorWrapper');
        iconWrapper.classList.add('iconWrapper');
        defaultView.classList.add('defaultView');
        newTheme.classList.add('theme');
        if (theme.isDefault) newTheme.classList.add('defaultTheme');
        newTheme.setAttribute('id', id);

        newTheme.addEventListener('click', () => {
            if (sessionStorage.getItem('buttonClicked') == 'false' && !defaultView.className.includes('hide'))
            useTheme(newTheme.hex, newTheme.hex2, newTheme.color);
        });

        defaultView.appendChild(colorWrapper);
        bannerWrapper.appendChild(iconWrapper);
        defaultView.appendChild(bannerWrapper);
        newTheme.appendChild(defaultView);
        newTheme.appendChild(touchHoldView);
        contentWrapper.appendChild(newTheme);
        i++;
    }

    if (isFirstTime) {
        buildCustomThemeSelection();
        createCustomTheme();
    }
}

function useTheme(hex, hex2, color) {
    const inputs = document.querySelectorAll('input, textarea');
    const borders = document.querySelectorAll('.entry, .theme, .detailedEntry, hr');
    const circles = document.getElementsByClassName('fa-check-circle');
    const id = getThemeId({hex: hex, hex2: hex2, color: color});
    const backgrounds = [
        document.getElementById('footer'),
        document.getElementById('currentType'),
        document.querySelectorAll('.selectPersonPopUp .button')[0],
        document.querySelectorAll('.selectPersonPopUp .button')[1],
        document.getElementById('backButton'),
        document.getElementById('continueWithSignIn'),
        document.getElementById('continueWithSignUp'),
    ];
    
    const colors = [
        document.querySelectorAll('.selectPersonPopUp .button')[0],
        document.querySelectorAll('.selectPersonPopUp .button')[1],
        document.getElementById('footer'),
        document.getElementById('backButton'),
        document.getElementById('continueWithSignIn'),
        document.getElementById('continueWithSignUp'),
    ];

    for (const input of inputs) {
        input.addEventListener('focus', () => {
            input.style.borderColor = hex;
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = 'lightgray';
        });
    }

    for (const background of backgrounds) {
        if (background !== undefined)
        background.style.background = hex;
    }

    for (const border of borders) {
        if (border !== undefined)
        border.style.borderColor = hex;
    }

    for (const circle of circles) {
        if (circle !== undefined)
        circle.classList.remove('active');
    }

    for (const clr of colors) {
        if (clr !== undefined)
        clr.style.color = color;
    }

    if (document.getElementById(`icon${id}`) !== null)
    document.getElementById(`icon${id}`).classList.add('active');
    document.getElementById('banner').getElementsByTagName('path')[0].style.fill = hex;
    document.getElementById('banner').getElementsByTagName('path')[1].style.fill = hex2;
    document.getElementById('startBanner').getElementsByTagName('path')[0].style.fill = hex;
    document.getElementById('startBanner').getElementsByTagName('path')[1].style.fill = hex2;
    
    if (firebase.auth().currentUser !== null && sessionStorage.getItem('deleteUser') !== 'true') {
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/theme`).set({
            hex: hex,
            hex2: hex2,
            color: color
        });
    }

    localStorage.setItem('theme', JSON.stringify({hex: hex, hex2: hex2, color: color}));
}

function buildCustomThemeSelection() {
    const contentWrapper = document.getElementById('createTheme')
    let i = 0;

    let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3284 1833.35"><path class="cls-1" style="fill: placeholder1" d="M1140.94,684c-155.16,499.63-933.06,460.5-957.35,718.72-21.26,226,539.19,631.7,957.35,480.19,427.3-154.82,421.09-580.76,802-705.76,504-165.41,934.55,597.07,1280.14,424.7,279.41-139.36,343-950.26,63.12-1168.83C2939.09,162,2263.86,957.77,1690.87,624.86,1450.31,485.1,1317.13,198.29,1213.63,251.5,1131.39,293.78,1204.06,480.73,1140.94,684Z" transform="translate(-183 -163.65)"/><path class="cls-2" style="fill: placeholder2; opacity: .6" d="M1601.2,1435.31c-635.61-475-935.69-428.72-1123.69-839.6-60.72-132.72-126.44-351-56.06-419.56C528.64,71.7,935.75,657.07,1465.77,626,1907.54,600.06,1997,165.07,2495.43,181.43c68.67,2.26,379.11,12.45,559.5,257.21,116.19,157.65,121.1,334.85,126.24,520.63,2.28,82.27,15.63,844.76-360.46,1011.58-48.61,21.57-137.42,48.12-347.28-4.53C2097.42,1872,1914.23,1669.23,1601.2,1435.31Z" transform="translate(-183 -163.65)"/></svg>';
    const bannerWrapper = document.createElement('div');
    const colorWrapper = document.createElement('div');
    const iconWrapper = document.createElement('div');
    const newTheme = document.createElement('div');

    svg = svg.replace('placeholder1', 'lightgray');
    svg = svg.replace('placeholder2', '#353535');
    bannerWrapper.innerHTML += svg;

    for (let i = 0; i < 2; i++) {
        const newColor = document.createElement('div');
        const icon = document.createElement('i');
        icon.setAttribute('class', 'fas fa-question');
        newColor.appendChild(icon);
        colorWrapper.appendChild(newColor);
    }

    const icon = document.createElement('i');
    icon.setAttribute('class', 'fas fa-chevron-right');
    iconWrapper.appendChild(icon);

    bannerWrapper.classList.add('bannerWrapper');
    colorWrapper.classList.add('colorWrapper');
    iconWrapper.classList.add('iconWrapper');
    newTheme.classList.add('theme');
    newTheme.setAttribute('id', 'customTheme');

    newTheme.addEventListener('click', () => {
        const customThemeWrapper = document.getElementById('customThemeWrapper');
        document.getElementById('themeOverview').style.left = '-100vw';
        customThemeWrapper.style.left = 0;

        changeHeadline('Theme erstellen');
    });

    newTheme.appendChild(colorWrapper);
    bannerWrapper.appendChild(iconWrapper);
    newTheme.appendChild(bannerWrapper);
    contentWrapper.appendChild(newTheme);
    i++;

    const hammer = new Hammer(document.getElementById('customThemeWrapper'));

    hammer.on('swiperight', () => {
        if (sessionStorage.getItem('isNavTriggered') === 'false') {
            const customThemeWrapper = document.getElementById('customThemeWrapper');
            document.getElementById('themeOverview').style.left = 0;
            customThemeWrapper.style.left = '100vw';

            changeHeadline('Theme');
        }
    });
}

function createCustomTheme() {
    const primaryColorPicker = document.getElementById('primaryColorPicker');
    const secondaryColorPicker = document.getElementById('secondaryColorPicker');
    const textColorPicker = document.getElementById('textColorPicker');
    const svg = document.getElementById('customThemeSvg');
    const customThemeSaveBtn = document.getElementById('customThemeSaveBtn');
    const customThemeUpdateBtn = document.getElementById('customThemeUpdateBtn');
    const customThemeCancelBtn = document.getElementById('customThemeCancelBtn');

    primaryColorPicker.addEventListener('input', () => {
        svg.getElementsByTagName('path')[0].style.fill = primaryColorPicker.value;
    });

    secondaryColorPicker.addEventListener('input', () => {
        svg.getElementsByTagName('path')[1].style.fill = secondaryColorPicker.value;
    });

    customThemeSaveBtn.addEventListener('click', () => {
        activateLoading(.3);
        const theme = {
            hex: primaryColorPicker.value,
            hex2: secondaryColorPicker.value,
            color: textColorPicker.value,
            isCustom: true
        };

        const id = getThemeId(theme);

        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/customThemes/${id}`).set(theme).then(() => {
            deactiveLoading();

            if (document.getElementById(id) === null) {
                printThemes([theme], false);
            }

            const customThemeWrapper = document.getElementById('customThemeWrapper');
            document.getElementById('themeOverview').style.left = 0;
            customThemeWrapper.style.left = '100vw';

            changeHeadline('Theme');

            setTimeout(() => {
                clearThemeInputs();
            }, 210);
        });
    });
    
    customThemeUpdateBtn.addEventListener('click', () => {
        activateLoading(.3);
        const theme = {
            hex: primaryColorPicker.value,
            hex2: secondaryColorPicker.value,
            color: textColorPicker.value,
            isCustom: true
        };
        
        const previousId = getThemeId(previousTheme);
        const id = getThemeId(theme);

        if (previousId !== id) {
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/customThemes/${id}`).set(theme).then(() => {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/customThemes/${previousId}`).remove().then(() => {
                    deactiveLoading();
    
                    const themeElement = document.getElementById(previousId);
                    themeElement.hex = theme.hex;
                    themeElement.hex2 = theme.hex2;
                    themeElement.color = theme.color;
    
                    const colorBoxes = themeElement.querySelectorAll('.defaultView .colorWrapper div');
                    colorBoxes[0].style.background = theme.hex;
                    colorBoxes[1].style.background = theme.hex2;
    
                    const paths = themeElement.querySelectorAll('.defaultView .bannerWrapper svg path');
                    paths[0].style.fill = theme.hex;
                    paths[1].style.fill = theme.hex2;
                    
                    const customThemeWrapper = document.getElementById('customThemeWrapper');
                    document.getElementById('themeOverview').style.left = 0;
                    customThemeWrapper.style.left = '100vw';
    
                    const themeIcon = themeElement.querySelector('.defaultView .bannerWrapper .iconWrapper i');
    
                    themeElement.setAttribute('id', id);
                    themeIcon.setAttribute('id', `icon${id}`);
    
                    changeHeadline('Theme');
    
                    if (themeIcon.className.includes('active')) {
                        useTheme(theme.hex, theme.hex2, theme.color);
                    }
    
                    setTimeout(() => {
                        clearThemeInputs();
                        customThemeUpdateBtn.classList.add('hide');
                        customThemeSaveBtn.classList.remove('hide');
                    }, 210);
                });
            });
        } else {
            deactiveLoading();
            const customThemeWrapper = document.getElementById('customThemeWrapper');
            document.getElementById('themeOverview').style.left = 0;
            customThemeWrapper.style.left = '100vw';
        }
    });

    customThemeCancelBtn.addEventListener('click', () => {
        const customThemeWrapper = document.getElementById('customThemeWrapper');
        document.getElementById('themeOverview').style.left = 0;
        customThemeWrapper.style.left = '100vw';

        changeHeadline('Theme');
    });
}

function clearThemeInputs() {
    document.getElementById('primaryColorPicker').value = 'lightgray';
    document.getElementById('secondaryColorPicker').value = '#353535';
    document.getElementById('textColorPicker').value = '#ffffff';

    const svg = document.getElementById('customThemeSvg');
    svg.getElementsByTagName('path')[0].style.fill = document.getElementById('primaryColorPicker').value;
    svg.getElementsByTagName('path')[1].style.fill = document.getElementById('secondaryColorPicker').value;
}

function getThemeId(theme) {
    return theme.hex.replace('#', '') + theme.hex2.replace('#', '') + theme.color.replace('#', '');
}