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
    const excursionsFieldInput = li.querySelectorAll('.excursions__field-input');
    const priceForAdult = excursionsPrice.querySelectorAll('span')[0];
    const priceForChild = excursionsPrice.querySelectorAll('span')[1];
    const errorMessagesContainer = document.createElement('div');
    const errorMessages = document.createElement('ul');
    errorMessages.className = 'errors';
    li.appendChild(errorMessagesContainer);
    errorMessagesContainer.appendChild(errorMessages);
    li.classList.remove('excursions__item--prototype');
    priceForAdult.classList.add('excursions__price--adult');
    priceForChild.classList.add('excursions__price--child');
    excursionTitle.innerText = excursion[1];
    excursionDescription.innerText = excursion[2];
    priceForAdult.innerText = excursion[3] + ' ';
    priceForChild.innerText = excursion[4] + ' ';

    excursionsFieldInput.forEach(function (excursion) {
        if (excursion.classList != 'excursions__field-input excursions__field-input--submit') {
            excursion.setAttribute('type', 'number');
        };
    });

    container.appendChild(li);
};

function renderBasket(form) {
    const basket = document.querySelector('.summary');
    const basketItemPrototype = document.querySelector('.summary__item--prototype');
    const basketItem = basketItemPrototype.cloneNode(true);
    basketItem.classList.remove('summary__item--prototype');
    const basketItemName = basketItem.querySelector('.summary__name');
    const basketItemSummaryTotalPrice = basketItem.querySelector('.summary__total-price');
    const basketItemSummaryPrices = basketItem.querySelector('.summary__prices');
    let numberOfAdults = form.querySelector('input[name=adults]').value;
    let numberOfChildren = form.querySelector('input[name=children]').value;
    const priceForAdults = form.firstElementChild.firstElementChild.firstElementChild.innerText;
    const priceForChildren = form.children.previousElementSibling.innerText;
    const totalPriceForAdults = numberOfAdults * priceForAdults;
    const totalPriceForChildren = numberOfChildren * priceForChildren;
    const totalPrice = totalPriceForAdults + totalPriceForChildren;

    if (numberOfAdults === '') {
        numberOfAdults = 0;
    };
    if (numberOfChildren === '') {
        numberOfChildren = 0;
    };

    basketItemName.innerText = form.previousElementSibling.firstElementChild.innerText;
    basketItemSummaryTotalPrice.innerText = totalPrice + ' PLN';
    basketItemSummaryPrices.innerText = 'dorośli: ' + numberOfAdults + ' x ' + totalPriceForAdults + ' PLN, dzieci: ' + numberOfChildren + ' x ' + totalPriceForChildren + ' PLN';

    basket.appendChild(basketItem);
};

function renderTotalBasketPrice() {
    const totalPriceItem = document.querySelector('.order__total-price-value');
    const excursionsPrices = document.querySelectorAll('.summary__total-price');
    const prices = [];
    let totalBasketPrice = 0;
    excursionsPrices.forEach(function (el) {
        if (el.parentElement.parentElement.className != 'summary__item summary__item--prototype') {
            const price = Number(el.innerText.slice(0, -4));
            prices.push(price);
        };
    });

    for (let i = 0; i < prices.length; i++) {
        totalBasketPrice += prices[i];
    };

    totalPriceItem.innerText = totalBasketPrice + ' PLN';
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
            const errors = target.parentElement.querySelector('.errors');
            clearErrorMessages(errors);
            validateNumbersOfParticipants(target);
            if (errors.children.length < 1) {
                renderBasket(target);
                renderTotalBasketPrice();
                clearExcursionForm(target);
            };
        }
    );
};

function clearExcursionForm(excursion) {
    excursion.querySelector('input[name=adults]').value = '';
    excursion.querySelector('input[name=children]').value = '';
};

function validateNumbersOfParticipants(form) {
    const numberOfAdults = Number(form.querySelector('input[name=adults]').value);
    const numberOfChildren = Number(form.querySelector('input[name=children]').value);
    const errorMessages = document.querySelector('.errors');

    if (numberOfAdults < 0) {
        const adultsErrorMessage = document.createElement('li');
        errorMessages.appendChild(adultsErrorMessage);
        adultsErrorMessage.innerText = 'Liczba osób dorosłych jest nieprawidłowa!';
    };
    if (numberOfChildren < 0) {
        const childrenErrorMessage = document.createElement('li');
        errorMessages.appendChild(childrenErrorMessage);
        childrenErrorMessage.innerText = 'Liczba dzieci jest nieprawidłowa!';
    };
};

function clearErrorMessages(errors) {
    while (errors.firstChild) {
        errors.removeChild(errors.firstChild);
    };
};