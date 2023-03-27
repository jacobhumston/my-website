/*

    Programmed by LovelyJacob (Jacob Humston).
    This code is open source, however I kindly ask for credit if used.
    Repository: https://github.com/jacobhumston/my-website

    Have a good one! :)

*/

function discordButton() {
    const element = document.getElementById('discord-link');
    const elementText = document.getElementById('discord-text');
    let coolDown = false;
    let originalText = elementText.innerText;
    element.addEventListener('click', async function () {
        if (coolDown) return;
        coolDown = true;
        try {
            await navigator.clipboard.writeText(originalText);
            elementText.innerText = 'Copied!';
        } catch {
            elementText.innerText = 'Failed to copy!';
        }
        setTimeout(function () {
            elementText.innerText = originalText;
            coolDown = false;
        }, 3000);
    });
}

function loaded() {
    discordButton();
}

window.addEventListener('load', loaded);
