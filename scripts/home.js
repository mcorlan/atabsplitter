/**
 * User: http://corlan.org
 * Date: 2/3/12
 * Time: 3:20 PM
 */

function updateHomeScreenValues() {
    //update total
    updateTotal();
    //update the edited plate
    if (currentObjectEdited) {
        updateTotalForPlate(currentObjectEdited);
    }
    currentObjectEdited = null;
}

function updateTotalForPlate(el) {
    var s, tip;
    s = el.getElementsByTagName('div')[0];
    if (s) {
        tip = parseInt(document.getElementById('tipSlider').value);
        s.innerHTML = addCommas(el['data-t'] + el['data-t'] * tip / 100);
    }
}

function updateTotal() {
    var t,l,i,tip;
    l = arrPlates.length;
    t = 0;
    tip = parseInt(document.getElementById('tipSlider').value);
    for (i = 0; i < l; i++) {
        if (arrPlates[i]['data-t']) {
            t += arrPlates[i]['data-t'];
            updateTotalForPlate(arrPlates[i]);
        }
    }
    t = t + t * tip / 100;
    document.getElementById('total').innerHTML = 'Total: ' + addCommas(t);
    persistApplicationState(arrPlates);
}

function addNewPlate(e) {
    var p, tip;
    tip = document.getElementById('tipWrapper');
    //don't add a plate if the user touched the tip slider
    if (e.target === tip || elementIsIn(e.target, tip))
        return;
    p = createNewPlate();
    p.style.top = e.offsetY + 'px';
    p.style.left = e.offsetX - 50 + 'px';
    document.getElementById('contentHome').appendChild(p);
    registerEventsForPlate(p);
    arrPlates[arrPlates.length] = p;
    currentObjectEdited = p;
    $.mobile.changePage($("#calculator"));
    initCalculatorForPlate();
    e.stopPropagation();
}

function registerEventsForPlate(element) {
    element.addEventListener('click',       editPlate,          false);
    element.addEventListener('touchstart',  dragTouchStart,     false);
    element.addEventListener('touchmove',   dragTouchMove,      false);
    element.addEventListener('touchend',    dragTouchEnd,       false);
    //events for dragging the div
    element.addEventListener('mousedown',   dragStart,          false);
}

function editPlate(e) {
//    console.log('edit plate');
    if (Math.abs(dragObj.elStartLeft - dragObj.elNode.offsetLeft) < 10 && Math.abs(dragObj.elStartTop - dragObj.elNode.offsetTop) < 10 ) {
        currentObjectEdited = dragObj.elNode;
        $.mobile.changePage($("#calculator"));
        initCalculatorForPlate();
    }
    e.stopPropagation();
}

function dragStart(e) {
//    console.log('mouse down');
    e.touches = [{clientX: e.clientX, clientY: e.clientY}];
    trashBin.style.opacity = 1;
    initializeDragingObject(e);
    // Capture mousemove and mouseup events on the page.
    document.addEventListener('mousemove',  dragGo,    true);
    document.addEventListener('mouseup',    dragStop,  true);
    e.preventDefault();
    e.stopPropagation();
}

function initializeDragingObject(e){
    dragObj.elNode = e.target.parentNode;
    dragObj.cursorStartX = e.touches[0].clientX + window.scrollX;
    dragObj.cursorStartY = e.touches[0].clientY + window.scrollY;
    dragObj.elStartLeft  = parseInt(dragObj.elNode.offsetLeft, 10);
    dragObj.elStartTop   = parseInt(dragObj.elNode.offsetTop,  10);
    // Update element's z-index.
    dragObj.elNode.style.zIndex = ++dragObj.zIndex;
}

function dragGo(e) {
   e.touches = [{clientX: e.clientX, clientY: e.clientY}];
   dragTouchMove(e)
}
function dragStop(e) {
   // Stop capturing mousemove and mouseup events.
   document.removeEventListener('mousemove', dragGo,   true);
   document.removeEventListener('mouseup',   dragStop, true);
   dragTouchEnd(e);
}

function dragTouchStart(e) {
    trashBin.style.opacity = 1;
    initializeDragingObject(e);
}
function dragTouchMove(e) {
    var x, y;
    // Get cursor position with respect to the page.
    x = e.touches[0].clientX + window.scrollX;
    y = e.touches[0].clientY + window.scrollY;
    // Move drag element by the same amount the cursor has moved.
    dragObj.elNode.style.left = dragObj.elStartLeft + x - dragObj.cursorStartX + 'px';
    dragObj.elNode.style.top  = dragObj.elStartTop  + y - dragObj.cursorStartY + 'px';
    e.stopPropagation();
    e.preventDefault();
}

function dragTouchEnd(e) {
    var t, p;
//    console.log('dragTouchEnd()');
    t = getPosition(trashBin);
    p = getPosition(dragObj.elNode);
    if (comparePositions(t[0], p[0]) && comparePositions(t[1], p[1])) {
        deletePlate(dragObj.elNode);
    } else {
        persistApplicationState(arrPlates);
    }
    trashBin.style.opacity = 0.3;
    e.stopPropagation();
    e.preventDefault();
}

function deletePlate(p) {
    //delete from array
    arrPlates.splice(arrPlates.indexOf(p), 1);
    p.parentNode.removeChild(p);
    //recalculate total
    updateTotal();
}

function createNewPlate() {
    var p;
    p = document.createElement('div');
    p.className = 'plate';
    p.innerHTML = '<img src="assets/images/plate-big.png"/>\n<div>0</div>\n';
//    p.innerHTML = '<img src="assets/images/plate-big.png"/>\n<div>0</div>\n<span></span>\n';
    return p;
}

function onTipChange(e) {
    updateTotal();
}

/**
 * *******************************************************************************************************
 * Functions for saving and restoring the application state (plates on the first screen)
 */

/**
 * Persists using web storage the existing plates
 * @param arr
 */
function persistApplicationState(arr) {
    var i, l, toSave, el;
    if (!arr)
        return;
    toSave = [];
    for (i = 0, l = arr.length; i<l; i++) {
        el = arr[i];
        toSave.push( {'top': el.style.top, 'left' :el.style.left, 'data-i': (el['data-i'] || []), 'data-t': (el['data-t'] || 0)} );
    }
    if (toSave.length > 0 && localStorage) {
        localStorage.setItem('plates', JSON.stringify(toSave));
    }
}
/**
 * return false if there is nothing saved or an array
 */
function getPersistedPlates() {
    var ret;
    if (!localStorage)
        return false;
    ret = JSON.parse(localStorage.getItem('plates'));
    if (!ret || ret.length === 0)
        return false;
    return ret;
}
/**
 * Assigns the persisted values to the plate (total, items, top, and left)
 * @param el plate element
 * @param values persisted
 */
function assignSavedValues(el, values) {
    el.style.top = values.top;
    el.style.left = values.left;
    el['data-i'] = values['data-i'];
    el['data-t'] = values['data-t'];
}
/**
 * Restore the application state (plates on the first screen) based on the persisted information
 * @param arr
 * @param parent
 */
function restoreApplicationState(arr, parent) {
    var el, i, l, arrPersisted;
    arrPersisted = getPersistedPlates();
    if (!arrPersisted)
        return;
    if (arrPersisted[0]) {
        assignSavedValues(arr[0], arrPersisted[0]);
        updateTotalForPlate(arr[0]);
    }
    for (i = 1, l = arrPersisted.length; i < l; i++) {
        el = createNewPlate();
        parent.appendChild(el);
        registerEventsForPlate(el);
        arr.push(el);
        assignSavedValues(el, arrPersisted[i]);
        updateTotalForPlate(el);
    }
    updateTotal();
}