setInterval(() => {
    if (!window.navigator.onLine) {
        if (!window.location.pathname.includes('offline')) {
            window.location.href = 'offline/index.html';
        }
    } else {
        if (window.location.pathname.includes('offline')) {
            window.location.href = '../index.html';
        }
    }
}, 500);