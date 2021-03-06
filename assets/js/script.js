document.addEventListener('DOMContentLoaded', init);

function init() {
    const inputField = document.querySelector('.uploader__input');
    const totalPriceItem = document.querySelector('.order__total-price-value');
    const orderPanel = document.querySelector('.panel__order ');
    totalPriceItem.innerText = '0 PLN';

    if (inputField) {
        inputField.addEventListener(
            'change',
            previewFileContent
        );
    };
    addToOrder();
    order();
    renderErrorMessages(orderPanel);
    deleteExcursionFromBasket();
};

function previewFileContent() {
    const errorFileMessage = document.querySelector('.error-file');
    if (errorFileMessage) {
        errorFileMessage.innerText = '';
    };

    const reader = new FileReader();
    const container = document.querySelector('.excursions');
    loadFile(reader, container);
};

function loadFile(reader, container) {
    const [file] = document.querySelector('input[type=file]').files;

    reader.addEventListener(
        "load",
        function () {
            clearExcursionPanel();
            clearFileErrors();
            const readerContent = Array.from(reader.result.split(/[\r\n]+/gm));
            const excursions = readerContent.map(function (el) {
                return el.split(/"?,?"/).slice(1, 6);
            });
            excursions.forEach(function (excursion) {
                renderExcursion(container, excursion);
            });
        }
    );

    if (file && file.type.includes('csv')) {
        reader.readAsText(file, 'UTF-8');
    } else {
        const panel = document.querySelector('.uploader');
        const errorFileMessage = document.createElement('div');
        errorFileMessage.innerText = 'Wybrany plik nie jest plikiem "csv"!';
        errorFileMessage.classList.add('errors');
        panel.appendChild(errorFileMessage);
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
    renderErrorMessages(excursionsPrice);
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
    basketItem.setAttribute('id', Math.floor(Math.random() * 101));
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
    basketItemSummaryPrices.innerText = 'doro??li: ' + numberOfAdults + ' x ' + totalPriceForAdults + ' PLN, dzieci: ' + numberOfChildren + ' x ' + totalPriceForChildren + ' PLN';

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
            const errors = target.querySelector('.errors');
            clearErrorMessages(errors);
            validateNumbersOfParticipants(target);
            if (errors.children.length === 0) {
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
    const errorMessages = form.querySelector('.errors');

    if (numberOfAdults < 0) {
        const adultsErrorMessage = document.createElement('li');
        errorMessages.appendChild(adultsErrorMessage);
        adultsErrorMessage.innerText = 'Liczba os??b doros??ych jest nieprawid??owa!';
    };
    if (numberOfChildren < 0) {
        const childrenErrorMessage = document.createElement('li');
        errorMessages.appendChild(childrenErrorMessage);
        childrenErrorMessage.innerText = 'Liczba dzieci jest nieprawid??owa!';
    };
};

function clearErrorMessages(errors) {
    if (errors) {
        while (errors.firstChild) {
            errors.removeChild(errors.firstChild);
        };
    };
};

function order() {
    const orderSubmitButton = document.querySelector('.panel__form');
    orderSubmitButton.addEventListener(
        'submit',
        function (e) {
            e.preventDefault();
            const target = e.target;
            const errors = target.querySelector('.errors');
            const totalPrice = target.querySelector('.order__total-price-value').innerText;
            const email = target.querySelector('input[name=email]').value;
            const panelSummary = document.querySelector('.panel__summary ');
            const totalPriceItem = document.querySelector('.order__total-price-value');

            clearErrorMessages(errors);
            validateDataBeforeOrdering();
            clearFileErrors();

            if (Array.from(panelSummary.children).length < 2) {
                console.log(Array.from(panelSummary.children));
                console.log(Array.from(panelSummary.children).length < 2);
                alert('Nie wybrano wycieczek!');
            } else if (errors.children.length < 1 && totalPriceItem.innerText !== '0 PLN') {
                alert('Dzi??kujemy za z??o??enie zam??wienia o warto??ci ' + totalPrice + '. Szczeg????y zam??wienia zosta??y wys??ane na adres e-mail: ' + email + '.');
                clearOrderForm(target);
                clearExcursionPanel();
                clearExcursionFromBasket();
                totalPriceItem.innerText = '0 PLN'
                const file = document.querySelector('input[type=file]')
                file.value = '';
            } else if (totalPriceItem.innerText === '0 PLN') {
                alert('Warto???? wybranych wycieczek wynosi 0 PLN!');
            } else {
                clearErrorMessages(errors);
                validateDataBeforeOrdering();
            };
        }
    );
};

function validateDataBeforeOrdering() {
    const regForName = /^\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*$/;
    const regFOrEmail = /\S+@\S+\.\S+/;
    const reg1 = new RegExp(regForName);
    const reg2 = new RegExp(regFOrEmail);
    const name = document.querySelector('input[name=name]');
    const email = document.querySelector('input[name=email]');
    const errors = name.parentElement.parentElement.parentElement.querySelector('.errors');

    if (name.value === '') {
        const errorEmptyNameField = document.createElement('li');
        errorEmptyNameField.innerText = 'Nie wype??niono pola "Imi?? i nazwisko"!';
        errors.appendChild(errorEmptyNameField);
    } else if (!reg1.test(name.value)) {
        const nameErrorMessage = document.createElement('li');
        nameErrorMessage.innerText = 'Podano b????dne dane w polu "Imi?? i nazwisko"!';
        errors.appendChild(nameErrorMessage);
    };

    if (email.value === '') {
        const errorEmptyEmailField = document.createElement('li');
        errorEmptyEmailField.innerText = 'Nie wype??niono pola "Email"!';
        errors.appendChild(errorEmptyEmailField);
    } else if (!reg2.test(email.value)) {
        const emailErrorMessage = document.createElement('li');
        emailErrorMessage.innerText = 'Podano b????dny adres email!';
        errors.appendChild(emailErrorMessage);
    };
};

function renderErrorMessages(container) {
    const errors = document.createElement('ul');
    errors.className = 'errors';
    container.appendChild(errors)
};

function clearOrderForm(form) {
    form.querySelector('input[name=name]').value = '';
    form.querySelector('input[name=email]').value = '';
};

function deleteExcursionFromBasket() {
    const basket = document.querySelector('.panel__summary');
    basket.addEventListener(
        'click',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target.parentElement.parentElement;
            const deleteButton = target.querySelector('.summary__btn-remove');
            const targetParent = target.parentElement;
            if (e.target === deleteButton) {
                targetParent.removeChild(target);
            };
            renderTotalBasketPrice();
        }
    );
};

function clearExcursionPanel() {
    const excursionsPanel = document.querySelector('.panel__excursions');
    if (excursionsPanel.children.length > 1) {
        if (excursionsPanel.lastChild) {
            while (excursionsPanel.lastChild && excursionsPanel.lastChild.className != 'excursions__item excursions__item--prototype') {
                excursionsPanel.removeChild(excursionsPanel.lastChild);
            };
        };
    };
};

function clearExcursionFromBasket() {
    const basket = document.querySelector('.panel__summary');
    if (basket) {
        while (basket.lastChild && basket.lastChild.className != 'summary__item summary__item--prototype') {
            basket.removeChild(basket.lastChild);
        };
    };
};

function clearFileErrors() {
    const uploader = document.querySelector('.uploader');
    const uploaderErrors = uploader.querySelector('.errors');
    if (uploaderErrors) {
        uploaderErrors.innerText = '';
    };
};