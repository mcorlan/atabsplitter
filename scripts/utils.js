/**
 * User: http://corlan.org
 * Date: 2/3/12
 * Time: 3:20 PM
 */
/**
 * Utility function for comparing the position of two DOM elements. Returns true
 * if the DOM elements overlap.
 * @param p1 position of the first element as return by getPosition(element)[i]
 * @param p2 position of the first element as return by getPosition(element)[i]
 */
function comparePositions(p1, p2) {
    var r1, r2;
    r1 = p1[0] < p2[0] ? p1 : p2;
    r2 = p1[0] < p2[0] ? p2 : p1;
    return r1[1] > r2[0] || r1[0] === r2[0];
}
/**
 * Returns an array with the position of the four corners of the component.
 * Dependency on jQuery
 * @param element DOM element
 */
function getPosition(element) {
    var pos, width, height;
    pos = $(element).position();
    width = $(element).width();
    height = $(element).height();
    return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
}
/**
 * Format a number with commas as thousand separator
 * @param num
 */
function addCommas(num) {
    num = Math.round(num * 100) / 100;
    num = num + '';
    return num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

/**
 * Check if the el is a children of the parent
 * @param el
 * @param parent
 */
function elementIsIn(el, parent) {
    var node = el.parentNode;
    while (node !== null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}