function printThemes(themes) {
    const contentWrapper = document.getElementById('themeWindow');    
    let i = 0;

    for (const theme of themes) {
        let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3284 1833.35"><path class="cls-1" style="fill: placeholder1" d="M1140.94,684c-155.16,499.63-933.06,460.5-957.35,718.72-21.26,226,539.19,631.7,957.35,480.19,427.3-154.82,421.09-580.76,802-705.76,504-165.41,934.55,597.07,1280.14,424.7,279.41-139.36,343-950.26,63.12-1168.83C2939.09,162,2263.86,957.77,1690.87,624.86,1450.31,485.1,1317.13,198.29,1213.63,251.5,1131.39,293.78,1204.06,480.73,1140.94,684Z" transform="translate(-183 -163.65)"/><path class="cls-2" style="fill: placeholder2; opacity: .6" d="M1601.2,1435.31c-635.61-475-935.69-428.72-1123.69-839.6-60.72-132.72-126.44-351-56.06-419.56C528.64,71.7,935.75,657.07,1465.77,626,1907.54,600.06,1997,165.07,2495.43,181.43c68.67,2.26,379.11,12.45,559.5,257.21,116.19,157.65,121.1,334.85,126.24,520.63,2.28,82.27,15.63,844.76-360.46,1011.58-48.61,21.57-137.42,48.12-347.28-4.53C2097.42,1872,1914.23,1669.23,1601.2,1435.31Z" transform="translate(-183 -163.65)"/></svg>';
        const bannerWrapper = document.createElement('div');
        const colorWrapper = document.createElement('div');
        const iconWrapper = document.createElement('div');
        const newTheme = document.createElement('div');

        svg = svg.replace('placeholder1', theme.hex);
        svg = svg.replace('placeholder2', theme.hex2);
        bannerWrapper.innerHTML += svg;

        for (let i = 0; i < 2; i++) {
            const newColor = document.createElement('div');
            i % 2 === 0 ? newColor.style.background = theme.hex : newColor.style.background = theme.hex2;
            colorWrapper.appendChild(newColor);
        }

        const icon = document.createElement('i');
        icon.setAttribute('class', 'far fa-check-circle');
        icon.setAttribute('id', `icon${theme.hex}`);
        iconWrapper.appendChild(icon);

        bannerWrapper.classList.add('bannerWrapper');
        colorWrapper.classList.add('colorWrapper');
        iconWrapper.classList.add('iconWrapper');
        newTheme.classList.add('theme');

        newTheme.addEventListener('click', () => {
            useTheme(theme.hex, theme.hex2, theme.color);
        });

        newTheme.appendChild(colorWrapper);
        bannerWrapper.appendChild(iconWrapper);
        newTheme.appendChild(bannerWrapper);
        contentWrapper.appendChild(newTheme);
        i++;
    }
}

function useTheme(hex, hex2, color) {
    const inputs = document.getElementsByTagName('input');
    const borders = document.querySelectorAll('.entry, .theme, .detailedEntry, hr');
    const circles = document.getElementsByClassName('fa-check-circle');
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

    if (document.getElementById(`icon${hex}`) !== null)
    document.getElementById(`icon${hex}`).classList.add('active');
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