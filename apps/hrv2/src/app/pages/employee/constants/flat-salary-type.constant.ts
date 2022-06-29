import { FlatSalaryTypeEnum } from '@minhdu-fontend/enums';

export const FlatSalaryTypeConstant = [
  {
    name: 'Lương cố định',
    value: FlatSalaryTypeEnum.FLAT_SALARY
  },
  {
    name: 'Lương không cố định',
    value: FlatSalaryTypeEnum.NOT_FLAT_SALARY
  },
  {
    name: 'Tất cả',
    value: FlatSalaryTypeEnum.ALL
  }
];
