let display = document.getElementById('display');
let displayValue = '';

function appendNumber(number) {
    displayValue += number;
    display.innerText = displayValue;
}

function appendOperator(operator) {
    displayValue += ` ${operator} `;
    display.innerText = displayValue;
}

function appendDot() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        display.innerText = displayValue;
    }
}

function clearDisplay() {
    displayValue = '';
    display.innerText = '0';
}

function calculateResult() {
    try {
        displayValue = eval(displayValue);
        display.innerText = displayValue;
    } catch {
        display.innerText = 'Error';
        displayValue = '';
    }
}
