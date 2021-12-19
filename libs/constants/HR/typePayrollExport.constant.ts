import { FilterTypeEnum, WarehouseTypeEnum } from '../../enums';

export const TypePayrollExportConstant = [
  {
    name: 'Xuất bảng tăng ca',
    value: FilterTypeEnum.OVERTIME
  },
  {
    name: 'Xuất bảng khấu trừ',
    value: FilterTypeEnum.ABSENT
  },
  {
    name: 'Xuất bảng phụ cấp lương',
    value: FilterTypeEnum.STAY
  },
  {
    name: 'Xuất bảng phụ cấp khác',
    value: FilterTypeEnum.ALLOWANCE
  },
  {
    name: 'Xuất bảng lương cơ bản',
    value: FilterTypeEnum.BASIC
  },
  {
    name: 'Xuất bảng lương công nhật',
    value: FilterTypeEnum.SEASONAL
  },
];
