import { PayrollEnum } from '../../enums';

export const PayrollConstant = [
  {
    name: 'Bảng lương',
    value: PayrollEnum.PAYROLL,
  },
  {
    name: 'Bảng tăng ca',
    value: PayrollEnum.PAYROLL_OVERTIME,
  },
  {
    name: 'Bảng chấm công',
    value: PayrollEnum.TIME_SHEET,
  },
  {
    name: 'Bảng lương công nhật',
    value: PayrollEnum.PAYROLL_SEASONAL,
  },
  {
    name: 'Bảng lương cơ bản',
    value: PayrollEnum.PAYROLL_BASIC
  },
  {
    name: 'Bảng phụ cấp lương',
    value: PayrollEnum.PAYROLL_STAY
  },
  {
    name: 'Bảng phụ cấp khác',
    value: PayrollEnum.PAYROLL_ALLOWANCE
  },
  {
    name: 'Bảng khấu trừ',
    value: PayrollEnum.PAYROLL_ABSENT
  },
]
