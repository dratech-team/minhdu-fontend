import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import {PriceTypeConstant} from "./price-type.constant";

export const BlockSalariesConstant = [
  {
    title: 'Lương cơ bản',
    type: SalaryTypeEnum.BASIC,
    priceTypes:PriceTypeConstant
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
