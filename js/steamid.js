const none = "00000000000000000";
const steamIdEl = document.getElementById('steamid');
const vanityEl = document.getElementById('vanity');
let steamId = none;
let check = 0;

async function updateSteamID() {
    try {
        const prev = check;
        clearTimeout(window.wow);

        window.wow = setTimeout(async () => {
            if (prev !== check) return;

            const response = await fetch(`https://cors.faav.top/steam/${encodeURIComponent(vanityEl.value)}`);
            if (response.ok) {
                const steamData = await response.json();
                setSteamID(steamData?.id || none, !steamData.error);
            }
        }, 275);
    } catch {
        setSteamID(none, false);
    }
}

function setSteamID(id, isValid) {
    steamId = id;
    steamIdEl.value = steamId;
    steamIdEl.style.opacity = isValid ? '1' : '.15';
    steamIdEl.style.cursor = isValid ? 'pointer' : '';
}

function detectSteam(path) {
    const detectedSteam = vanityEl.value.split(path).pop().split('/')[0];
    vanityEl.value = detectedSteam;
}

vanityEl.addEventListener('input', async () => {
    if (vanityEl.value.includes('profiles/')) detectSteam('profiles/');
    else if (vanityEl.value.includes('id/')) detectSteam('id/');

    vanityEl.value = vanityEl.value.replace(/\s/g, '');
    check++;

    vanityEl.value.length ? await updateSteamID() : setSteamID(none, false);
});

async function copyTextToClipboard(text) {
    if (text === none) return;
    try {
        await navigator.clipboard.writeText(text);
        console.log('Copied!');
    } catch {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    Object.assign(textArea.style, { top: "0", left: "0", position: "fixed" });

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        console.log('Fallback: Copying text command was successful');
    } catch (err) {
        console.error('Fallback: Unable to copy', err);
    }

    document.body.removeChild(textArea);
}

tippy('#steamid', {
    content: "Copied!",
    trigger: 'click',
    animation: 'shift-away',
    hideOnClick: false,
    theme: 'translucent',
    offset: [0, -10],
    onShow(instance) {
        if (steamId === none) return false;
        setTimeout(() => instance.hide(), 500);
    }
});

steamIdEl.addEventListener('click', () => copyTextToClipboard(steamId));

window.addEventListener("copy", (e) => {
    const copiedText = window.getSelection().toString().trim();
    if (/^\d+$/.test(copiedText.replace(/\s/g, ""))) {
        e.clipboardData.setData("text/plain", steamId);
        e.preventDefault();
    }
});