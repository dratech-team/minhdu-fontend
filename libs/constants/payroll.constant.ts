import { PayrollEnum } from '../enums';

export const PayrollConstant = [
  {
    name: 'Phiếu lương',
    value: PayrollEnum.PAYROLL
  },
  {
    name: 'Phiếu tăng ca',
    value: PayrollEnum.PAYROLL_OVERTIME
  },
  {
    name: 'Phiếu chấm công',
    value: PayrollEnum.TIME_SHEET
  },
  {
    name: 'Phiếu lương công nhật',
    value: PayrollEnum.PAYROLL_SEASONAL
  },
]
