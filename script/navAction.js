window.addEventListener('load', () => {
    const title = document.getElementById('title');
    const disableNav = document.getElementById('disableNav');
    const signOut = document.getElementById('signOut');
    const windows = [
        {navElement: document.getElementById('deletedFooter'), name: 'Gelöscht', window: document.getElementById('deletedEntriesWindow')},
        {navElement: document.getElementById('entriesFooter'), name: 'Einträge', window: document.getElementById('entriesWindow')},
        {navElement: document.getElementById('addEntryFooter'), name: 'Eintrag erstellen', window: document.getElementById('createEntryWindow')},
        {navElement: document.getElementById('entriesNav'), name: 'Einträge', window: document.getElementById('entriesWindow')},
        {navElement: document.getElementById('deletedNav'), name: 'Eintrag erstellen', window: document.getElementById('deletedEntriesWindow')},
    ];

    
    for (const window of windows) {
        window.navElement.addEventListener('click', () => {
            hideAllWindows();
            window.window.classList.remove('hide');
            title.textContent = window.name;

            if (window.navElement.id.toLowerCase().includes('nav')) {
                disableNav.click();
            }
        });
    }

    function hideAllWindows() {
        for (const window of windows) {
            window.window.classList.add('hide');
        }
    }

    signOut.addEventListener('click', () => {
        document.getElementById('disableNav').click();
        
        setTimeout(() => {
            firebase.auth().signOut();
        }, 550);

    });
});