"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusOrder = void 0;
var StatusOrder;
(function (StatusOrder) {
    StatusOrder[StatusOrder["DELIVERED"] = 1] = "DELIVERED";
    StatusOrder[StatusOrder["DELIVERING"] = 0] = "DELIVERING";
    StatusOrder[StatusOrder["ALL"] = -1] = "ALL";
})(StatusOrder = exports.StatusOrder || (exports.StatusOrder = {}));
