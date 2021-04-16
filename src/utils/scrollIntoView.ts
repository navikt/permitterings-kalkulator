function delay() {
    setTimeout(function () {
        checkUrlHash(document.location.hash);
    }, 200);
}

function checkOnreadyStatechange() {
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            delay();
        }
    };
}

export function scrollIntoView() {
    document.readyState === 'complete' ? delay() : checkOnreadyStatechange();
}

function checkUrlHash(hash: string) {
    if (hash.length > 0) {
        const sectionId = document.getElementById(hash.split('#')[1]);
        if (sectionId) {
            sectionId.scrollIntoView();
        }
    }
}
