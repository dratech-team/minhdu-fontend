"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FianceConstant = void 0;
var finance_enum_1 = require("../../enums/admin/finance.enum");
exports.FianceConstant = [
    {
        name: 'Khoản thu',
        value: finance_enum_1.FinanceEnum.COLLECT,
    },
    {
        name: 'Khoản chưa thu',
        value: finance_enum_1.FinanceEnum.LOAN,
    },
    {
        name: 'Khoản chi',
        value: finance_enum_1.FinanceEnum.PAY,
    },
    {
        name: 'Khoản nợ',
        value: finance_enum_1.FinanceEnum.DEBTS,
    },
];
