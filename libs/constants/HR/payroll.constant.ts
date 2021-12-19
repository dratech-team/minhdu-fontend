import { FilterTypeEnum } from '../../enums';


export const PayrollConstant = [
  {
    name: 'Bảng lương',
    value: FilterTypeEnum.PAYROLL,
  },
  {
    name: 'Bảng tăng ca',
    value: FilterTypeEnum.OVERTIME,
  },
  {
    name: 'Bảng chấm công',
    value: FilterTypeEnum.TIME_SHEET,
  },
  {
    name: 'Bảng lương công nhật',
    value: FilterTypeEnum.SEASONAL,
  },
  {
    name: 'Bảng lương cơ bản',
    value: FilterTypeEnum.BASIC
  },
  {
    name: 'Bảng phụ cấp lương',
    value: FilterTypeEnum.STAY
  },
  {
    name: 'Bảng phụ cấp khác',
    value: FilterTypeEnum.ALLOWANCE
  },
  {
    name: 'Bảng khấu trừ',
    value: FilterTypeEnum.ABSENT
  },
]
