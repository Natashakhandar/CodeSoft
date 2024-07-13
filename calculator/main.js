function press(num) {
    document.getElementById('display-box').value += num;
}
function calculate() {
    document.getElementById('display-box').value = eval(document.getElementById('display-box').value);
}
function clearDisplay() {
    document.getElementById('display-box').value = '';
}

function deleteChar() {
    var display = document.getElementById('display-box');
    display.value = display.value.slice(0, -1);
}

function addBracket() {
    var display = document.getElementById('display-box');
    var openBrackets = (display.value.match(/\(/g) || []).length;
    var closeBrackets = (display.value.match(/\)/g) || []).length;

    if (openBrackets > closeBrackets) {
        display.value += ')';
    } else {
        display.value += '(';
    }
}