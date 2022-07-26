"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineQueries = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function combineQueries(observables) {
    return (0, rxjs_1.combineLatest)(observables).pipe((0, operators_1.auditTime)(0));
}
exports.combineQueries = combineQueries;
