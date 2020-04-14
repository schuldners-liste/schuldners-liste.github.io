function activateLoading(opacity) {
    const mainScreen = document.getElementById('mainScreen');
    const loader = document.getElementById('loader');

    mainScreen.style.opacity = opacity;
    loader.classList.remove('hide');
}

function deactiveLoading() {
    const mainScreen = document.getElementById('mainScreen');
    const loader = document.getElementById('loader');

    mainScreen.style.opacity = 1;
    loader.classList.add('hide');
}