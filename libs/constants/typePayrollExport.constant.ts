import { PayrollEnum, WarehouseTypeEnum } from '../enums';

export const TypePayrollExportConstant = [
  {
    name: 'Xuất bảng tăng ca',
    value: PayrollEnum.PAYROLL_OVERTIME
  },
  {
    name: 'Xuất bảng khấu trừ',
    value: PayrollEnum.PAYROLL_ABSENT
  },
  {
    name: 'Xuất bảng phụ cấp lương',
    value: PayrollEnum.PAYROLL_STAY
  },
  {
    name: 'Xuất bảng phụ cấp khác',
    value: PayrollEnum.PAYROLL_ALLOWANCE
  },
  {
    name: 'Xuất bảng lương cơ bản',
    value: PayrollEnum.PAYROLL_BASIC
  },
  {
    name: 'Xuất bảng lương công nhật',
    value: PayrollEnum.PAYROLL_SEASONAL
  },
];
