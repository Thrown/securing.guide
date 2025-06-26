const urlParams = new URLSearchParams(window.location.search);
let stepParam = Number(urlParams.get('step')) - 1 || 0;
let currentPage = Math.max(0, stepParam);

const list = document.getElementById("list");
const stepDisplay = document.getElementById("stepDisplay");
const prevEl = document.getElementById("prevEl");
const nextEl = document.getElementById("nextEl");

function nextPage() {
    if (currentPage < steps.length - 1) loadPage(++currentPage);
}

function prevPage() {
    if (currentPage > 0) loadPage(--currentPage);
}

function loadPage(page) {
    if (!Array.isArray(steps) || steps.length === 0) return;

    const maxPage = Math.min(steps.length - 1, Math.max(0, page));
    if (page !== maxPage) {
        const url = new URL(window.location);
        url.searchParams.set("step", maxPage + 1);
        window.location.href = url.toString();
        return;
    }

    steps[page].points.forEach((point, i) => {
        var liEl = document.createElement('li');
        var hasMdLink = /^(?=.*\[)(?=.*\])(?=.*\()(?=.*\)).*$/.test(point);

        if (hasMdLink) {
            var textAreaTag = document.createElement("textarea");
            textAreaTag.textContent = point;
            point = textAreaTag.innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

            var elements = point.match(/\[.*?\)/g);
            if (elements && elements.length > 0) {
                for (const el of elements) {
                    let text = el.match(/\[(.*?)\]/)[1];
                    let url = el.match(/\((.*?)\)/)[1];
                    let aTag = document.createElement("a");
                    let urlHref = new URL(url);
                    urlHref.protocol = "https:";
                    aTag.href = urlHref;
                    aTag.target = '_blank';
                    aTag.textContent = text;
                    point = point.replace(el, aTag.outerHTML)
                }
            }
        }

        if (list.children[i]) {
            list.children[i].style.animation = 'fadeInAndOut .35s';
            setTimeout(() => {
                list.children[i].innerHTML = point;
                setTimeout(() => list.children[i].style.animation = '', 75)
            }, 175)
        } else {
            liEl.innerHTML = point;
            list.append(liEl)
        }
    });

    prevEl.toggleAttribute("disabled", currentPage === 0);
    nextEl.toggleAttribute("disabled", currentPage === steps.length - 1);

    stepDisplay.textContent = `Step ${currentPage + 1} of ${steps.length}`;
    history.pushState('', '', currentPage === 0 ? location.pathname : `?step=${currentPage + 1}`);
}

loadPage(currentPage);