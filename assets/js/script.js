document.addEventListener('DOMContentLoaded', init);

function init() {
    const inputField = document.querySelector('.uploader__input');
    const totalPriceItem = document.querySelector('.order__total-price-value');
    totalPriceItem.innerText = '0 PLN';

    if (inputField) {
        inputField.addEventListener(
            'change',
            previewFileContent
        );
    };
    addToOrder();
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
    priceForAdult.classList.add('excursions__price--adult');
    priceForChild.classList.add('excursions__price--child');
    excursionTitle.innerText = excursion[1];
    excursionDescription.innerText = excursion[2];
    priceForAdult.innerText = excursion[3] + ' ';
    priceForChild.innerText = excursion[4] + ' ';

    container.appendChild(li);
};

function renderBasket(excursion) {
    const basket = document.querySelector('.summary');
    const basketItemPrototype = document.querySelector('.summary__item--prototype');
    const basketItem = basketItemPrototype.cloneNode(true);
    basketItem.classList.remove('summary__item--prototype');
    const basketItemName = basketItem.querySelector('.summary__name');
    const basketItemSummaryTotalPrice = basketItem.querySelector('.summary__total-price');
    const basketItemSummaryPrices = basketItem.querySelector('.summary__prices');
    const totalPriceItem = document.querySelector('.order__total-price-value');
    const numberOfAdults = excursion.querySelector('input[name=adults]').value;
    const numberOfChildren = excursion.querySelector('input[name=children]').value;
    const priceForAdults = excursion.firstElementChild.firstElementChild.firstElementChild.innerText;
    const priceForChildren = excursion.children.previousElementSibling.innerText;
    const totalPriceForAdults = numberOfAdults * priceForAdults;
    const totalPriceForChildren = numberOfChildren * priceForChildren;
    const totalPrice = totalPriceForAdults + totalPriceForChildren;

    basketItemName.innerText = excursion.previousElementSibling.firstElementChild.innerText;
    basketItemSummaryTotalPrice.innerText = totalPrice + ' PLN';
    totalPriceItem.innerText = totalPrice + ' PLN';
    basketItemSummaryPrices.innerText = 'dorośli: ' + numberOfAdults + ' x ' + totalPriceForAdults + ' PLN, dzieci: ' + numberOfChildren + ' x ' + totalPriceForChildren + ' PLN';

    basket.appendChild(basketItem);
};

function getANumberOfAdults() {
    return adults = document.querySelector('input[name=adults]').value;
};

function getANumberOfChildren() {
    return children = document.querySelector('input[name=children]').value;
};

function addToOrder() {
    const panelExcursions = document.querySelector('.panel__excursions');
    panelExcursions.addEventListener(
        'submit',
        function (e) {
            e.preventDefault();
            const target = e.target;
            renderBasket(target);
            clearExcursionForm(target);
        }
    );
};

function clearExcursionForm(excursion) {
    excursion.querySelector('input[name=adults]').value = '';
    excursion.querySelector('input[name=children]').value = '';
};