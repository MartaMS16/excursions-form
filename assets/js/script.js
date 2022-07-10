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
    loadFile(reader);
};

function loadFile(reader) {
    const container = document.querySelector('.excursions');
    const [file] = document.querySelector('input[type=file]').files;

    reader.addEventListener(
        "load", function () {
            container.innerText = reader.result;
        }
    );

    if (file) {
        reader.readAsText(file);
    };
};