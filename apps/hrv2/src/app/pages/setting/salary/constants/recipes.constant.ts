import { PriceType } from '../enums';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { DiveEnum } from '../enums/dive.enum';

export interface recipeType {
  name: string;
  value: PriceType;
  diveFor?: {
    name: string;
    value: DiveEnum;
  }[];
  salariesConstant?: {
    name: string;
    value: string;
  }[];
}

const diveForConstant: { name: string; value: DiveEnum }[] = [
  {
    name: 'Ngày công chuẩn',
    value: DiveEnum.STANDARD,
  },
  {
    name: 'Tuỳ chọn',
    value: DiveEnum.OTHER,
  },
];

export const salariesConstant = [
  {
    name: 'Lương cơ bản',
    value: SalaryTypeEnum.BASIC,
  },
  {
    name: 'Phụ cấp lương',
    value: SalaryTypeEnum.STAY,
  },
  {
    name: 'Lương cơ bản trích bảo hiểm',
    value: SalaryTypeEnum.BASIC_INSURANCE,
  },
];

export const recipesConstant: recipeType[] = [
  {
    name: 'Đơn giá',
    value: PriceType.PRICE,
    diveFor: diveForConstant,
  },
  {
    name: 'Loại lương',
    value: PriceType.BLOCK,
    diveFor: diveForConstant,
    salariesConstant: salariesConstant,
  },
];

export const recipesConstantOvertime: recipeType[] = [
  {
    name: 'Đơn giá',
    value: PriceType.PRICE,
  },
  {
    name: 'Loại lương',
    value: PriceType.BLOCK,
    diveFor: diveForConstant,
    salariesConstant: salariesConstant,
  },
];
