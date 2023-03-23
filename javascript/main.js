function updateTitle() {
    document.title = document.title + " | LovelyJacob's Portfolio";
}

function loaded() {
    updateTitle();
}

window.addEventListener('load', loaded);
