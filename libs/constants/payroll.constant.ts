import { PayrollEnum } from '../enums';

export const PayrollConstant = [
  {
    name: 'Phiếu lương',
    value: PayrollEnum.PAYROLL
  },
  {
    name: 'PHIẾU TĂNG CA',
    value: PayrollEnum.PAYROLL_OVERTIME
  },
  {
    name: 'PHIẾU CHẤM CÔNG',
    value: PayrollEnum.TIME_SHEET
  },
  {
    name: 'Phiếu lương công nhật',
    value: PayrollEnum.PAYROLL_SEASONAL
  },
]
