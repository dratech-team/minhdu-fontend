import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import {PriceTypeConstant} from "./price-type.constant";

export const BlockSalariesConstant = [
  {
    title: 'Lương cơ bản',
    type: SalaryTypeEnum.BASIC,
  },
  {
    title: 'Phụ cấp lương',
    type: SalaryTypeEnum.STAY,
  },
  {
    title: 'Khấu trừ',
    type: SalaryTypeEnum.ABSENT,
    priceTypes:PriceTypeConstant,
    constraintHoliday: true,
  },
  {
    title: 'Tăng ca',
    type: SalaryTypeEnum.OVERTIME,
    constraintOvertime: true,
  },
  {
    title: 'Ngày lễ',
    type: SalaryTypeEnum.HOLIDAY
  },
];
