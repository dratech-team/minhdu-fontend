import { SalaryTypeEnum } from '../../enums';

export const BlockSalariesConstant = [
  {
    title: 'Lương cơ bản',
    type: SalaryTypeEnum.BASIC
  },
  {
    title: 'Phụ cấp lương',
    type: SalaryTypeEnum.STAY
  },
  {
    title: 'Khấu trừ',
    type: SalaryTypeEnum.ABSENT
  },
  {
    title: 'Tăng ca',
    type: SalaryTypeEnum.OVERTIME
  },
  {
    title: 'Ngày lễ',
    type: SalaryTypeEnum.HOLIDAY
  },
];
