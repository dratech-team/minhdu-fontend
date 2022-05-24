import {DatetimeUnitEnum} from '@minhdu-fontend/enums';
import {SalaryTypeEnum} from '../enums';

export const UnitDatetimeConstant: { name: string, value: DatetimeUnitEnum, salaryType: SalaryTypeEnum[] }[] = [
  {
    name:'Tháng',
    value: DatetimeUnitEnum.MONTH,
    salaryType: [SalaryTypeEnum.ALLOWANCE]
  },
  {
    name: 'Ngày',
    value: DatetimeUnitEnum.DAY,
    salaryType: [SalaryTypeEnum.ABSENT, SalaryTypeEnum.OVERTIME, SalaryTypeEnum.HOLIDAY ,SalaryTypeEnum.ALLOWANCE]
  },
  {
    name: 'Giờ',
    value: DatetimeUnitEnum.HOUR,
    salaryType: [SalaryTypeEnum.OVERTIME]
  },
  {
    name: 'Phút',
    value: DatetimeUnitEnum.MINUTE,
    salaryType: [SalaryTypeEnum.ABSENT]
  }
];


