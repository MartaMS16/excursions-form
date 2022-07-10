document.addEventListener('DOMContentLoaded', init);

function init() {
    const inputField = document.querySelector('.uploader__input');
    if (inputField) {
        inputField.addEventListener(
            'change',
            previewFileContent
        );
    };
};

function previewFileContent() {
    const reader = new FileReader();
    const container = document.querySelector('.excursions');
    loadFile(reader, container);
};

function loadFile(reader, container) {
    const [file] = document.querySelector('input[type=file]').files;

    reader.addEventListener(
        "load",
        function () {
            const readerContent = Array.from(reader.result.split(/[\r\n]+/gm));
            const excursions = readerContent.map(function (el) {
                return el.split(/"?,?"/).slice(1, 6);
            });
            excursions.forEach(function (excursion) {
                renderExcursion(container, excursion);
            });
        }
    );

    if (file) {
        reader.readAsText(file, 'UTF-8');
    };
};

function renderExcursion(container, excursion) {
    const prototype = document.querySelector('.excursions__item--prototype');
    const li = prototype.cloneNode(true);
    const excursionTitle = li.querySelector('.excursions__title');
    const excursionDescription = li.querySelector('.excursions__description');
    const excursionsPrice = li.querySelector('.excursions__form');
    const priceForAdult = excursionsPrice.querySelectorAll('span')[0];
    const priceForChild = excursionsPrice.querySelectorAll('span')[1];
    li.classList.remove('excursions__item--prototype');
    excursionTitle.innerText = excursion[1];
    excursionDescription.innerText = excursion[2];
    priceForAdult.innerText = excursion[3] + ' ';
    priceForChild.innerText = excursion[4] + ' ';

    container.appendChild(li);
};