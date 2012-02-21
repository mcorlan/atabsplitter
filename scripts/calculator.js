/**
 * User: http://corlan.org
 * Date: 2/3/12
 * Time: 3:19 PM
 */
function initCalculatorForPlate() {
    var el;
    el = document.getElementById('calculatorDisplay');
    if (!currentObjectEdited['data-i']) {
        currentObjectEdited['data-i'] = [];
    }
    if (!currentObjectEdited['data-t']) {
        currentObjectEdited['data-t'] = 0;
    }
    currentObjectEdited['data-old-i'] = currentObjectEdited['data-i'];
    currentObjectEdited['data-old-t'] = currentObjectEdited['data-t'];
    setTextCalculator(currentObjectEdited['data-i'].join('+') + '|');
    recalculate();
}

function addChar(c, e) {
    var arr, el;
    if ('ontouchstart' in e.target && e.type === 'mousedown')
        return;
    el = document.getElementById('calculatorDisplay');
    arr = getTextCalculator().split('|');
    if (arr[0].length == 0) {
        arr[0] = c;
    } else {
        arr[0] += c;
    }
    el.innerHTML = arr.join('|');
    recalculate();
}

function delChar(e) {
    var carretPosition, t;
    if ('ontouchstart' in e.target && e.type === 'mousedown')
        return;
    carretPosition = getCarretPossition() - 1;
    if (carretPosition < 0)
        return;
    t = getTextCalculator();
    setTextCalculator(t.substring(0, carretPosition) + t.substring(carretPosition + 1, t.length));
    recalculate();
}

function recalculate() {
    var t, arr, l, c, i;
    if (!currentObjectEdited)
        window.history.back();
    t = getTextCalculator();
    t = t.replace('|', '');
    arr = t.split('+');
    l = arr.length;
    currentObjectEdited['data-i'] = [];
    currentObjectEdited['data-t'] = 0;

    for (i=0; i<l; i++) {
        if (arr[i] != '') {
            c = parseFloat(arr[i]);
            currentObjectEdited['data-i'][i] = c;
            currentObjectEdited['data-t'] += c;
        }
    }

    document.getElementById('calculatorTotal').innerHTML = 'Total: ' + addCommas(currentObjectEdited['data-t']);
}

function moveCarret(pos, e) {
    var carretPosition,t;
    if ('ontouchstart' in e.target && e.type === 'mousedown')
        return;
    carretPosition = getCarretPossition() + pos;
    var t = getTextCalculator();
    if (carretPosition < 0 || carretPosition > t.length)
        return;
    t = t.replace('|', '');
    setTextCalculator(t.substring(0, carretPosition) + '|' + t.substring(carretPosition, t.length));
}

function onSave(e) {
    recalculate();
//    $.mobile.changePage($("#contentHome"));
    updateHomeScreenValues();
}

function onCancel(e) {
    currentObjectEdited['data-i'] = currentObjectEdited['data-old-i'];
    currentObjectEdited['data-t'] = currentObjectEdited['data-old-t'];
//    $.mobile.changePage($("#contentHome"));
}

function getCarretPossition() {
    var carretPosition, t;
    carretPosition = 0;
    t = getTextCalculator();
    if (t.length) {
        carretPosition = t.indexOf('|');
    }
    return carretPosition;
}

function getTextCalculator() {
    return document.getElementById('calculatorDisplay').innerHTML;
}

function setTextCalculator(t) {
    document.getElementById('calculatorDisplay').innerHTML = t;
}


