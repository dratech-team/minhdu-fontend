import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import {PriceTypeConstant} from "./price-type.constant";
import {PriceTypeEnum} from "../enums";

interface blockSalary{
  title: string,
  type: SalaryTypeEnum,
  showRate?:{
    disabled: boolean
  }
  constraintHoliday?: boolean,
  constraintOvertime?: boolean
  priceTypes?:{
    name: string,
    value: PriceTypeEnum
  }[],
  showPrice?: boolean
}

export const BlockSalariesConstant:blockSalary[] = [
  {
    title: 'Lương cơ bản',
    type: SalaryTypeEnum.BASIC,
    showRate:{
      disabled: false
    },
    showPrice: true
  },
  {
    title: 'Phụ cấp lương',
    type: SalaryTypeEnum.STAY,
    showRate:{
      disabled: false
    },
    showPrice: true
  },
  {
    title: 'Khấu trừ',
    type: SalaryTypeEnum.ABSENT,
    priceTypes:PriceTypeConstant,
    constraintHoliday: true,
    showRate:{
      disabled: false
    },
    showPrice: true
  },
  {
    title: 'Tăng ca',
    type: SalaryTypeEnum.OVERTIME,
    constraintOvertime: true,
    showRate:{
      disabled: false
    },
    showPrice: true
  },
  {
    title: 'Ngày lễ',
    type: SalaryTypeEnum.HOLIDAY,
    showRate:{
      disabled: false
    },
    showPrice: true
  },
];
