import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { SalaryTypeEnum } from '../enums';

export const UnitDatetimeConstant: { name: string, value: DatetimeUnitEnum, salaryType: SalaryTypeEnum[] }[] = [
  // {
  //   name:'Tháng',
  //   value: DatetimeUnitEnum.MONTH,
  //   salaryType: [SalaryTypeEnum.ABSENT]
  // },
  {
    name: 'Ngày',
    value: DatetimeUnitEnum.DAY,
    salaryType: [SalaryTypeEnum.ABSENT, SalaryTypeEnum.OVERTIME]
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


