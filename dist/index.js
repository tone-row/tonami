'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function isVars(o) {
    return typeof o === "object";
}
/**
 * Takes a nested object and returns an object with all of the keys
 * converted to css property names using a "-" to adjoin childnames
 * to their parent
 *
 * Input:
 * { colors: { red: 'red', blue: 'blue' } }
 *
 * Output:
 * { "--colors-red": 'red', "--colors-blue": 'blue' }
 */
function transformVars(vars, start) {
    if (start === void 0) { start = "-"; }
    var o = {};
    for (var key in vars) {
        var value = vars[key];
        var fullKey = [start, key].filter(Boolean).join("-");
        if (isVars(value)) {
            o = __assign(__assign({}, o), transformVars(value, fullKey));
        }
        else {
            o[fullKey] = value;
        }
    }
    return o;
}
function objectToString(obj) {
    var str = "";
    for (var key in obj) {
        str += key + ": " + obj[key] + ";";
    }
    return str;
}
var uniqueId = 0;
function makeStyleTag() {
    var style = document.createElement("style");
    style.setAttribute("id", "cssvars" + uniqueId);
    document.head.appendChild(style);
    return style;
}
// either a selector string, or an element ref
function createDynamicTag() {
    var style = makeStyleTag();
    return function (selector, vars) {
        var obj = transformVars(vars);
        style.innerHTML = selector + " { " + objectToString(obj) + " }";
    };
}
function useDynamicStyle(vars) {
    return transformVars(vars);
}

exports.createDynamicTag = createDynamicTag;
exports.makeStyleTag = makeStyleTag;
exports.transformVars = transformVars;
exports.useDynamicStyle = useDynamicStyle;
//# sourceMappingURL=index.js.map
