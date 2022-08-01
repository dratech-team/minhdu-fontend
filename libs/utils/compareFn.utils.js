"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFN = void 0;
var compareFN = function (o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
};
exports.compareFN = compareFN;
