import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

export const UnitSalaryConstant: Array<{ name: string; value: DatetimeUnitEnum }> = [
  {
    name: 'Tháng',
    value: DatetimeUnitEnum.MONTH
  },
  {
    name: 'Ngày',
    value: DatetimeUnitEnum.DAY
  },
  {
    name: 'Giờ',
    value: DatetimeUnitEnum.HOUR
  },
  {
    name: 'Phút',
    value: DatetimeUnitEnum.MINUTE
  }
];
