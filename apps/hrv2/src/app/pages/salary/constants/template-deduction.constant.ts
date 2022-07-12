import { SalarySettingEntity } from '../../setting/salary/entities';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';

export const templateDeductionConstant: SalarySettingEntity[] = [
  {
    id: 0,
    title: 'Khác',
    type: SalaryTypeEnum.ABSENT,
    rate: 1,
    unit: DatetimeUnitEnum.MONTH,
    totalOf: [],
  },
];
