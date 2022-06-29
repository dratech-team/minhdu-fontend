import { FinanceEnum } from '../../enums/admin/finance.enum';

export const FianceConstant = [
  {
    name: 'Khoản thu',
    value: FinanceEnum.COLLECT,
  },
  {
    name: 'Khoản chưa thu',
    value: FinanceEnum.LOAN,
  },
  {
    name: 'Khoản chi',
    value: FinanceEnum.PAY,
  },
  {
    name: 'Khoản nợ',
    value: FinanceEnum.DEBTS,
  },
];
