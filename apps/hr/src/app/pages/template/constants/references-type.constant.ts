import { DiveTypeEnum, salaryReference } from '../enums';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';

export interface RefernceType {
  name: string;
  value: salaryReference;
  dives?: {
    name: string;
    value: DiveTypeEnum;
  }[];
  recipes?: {
    name: string;
    value: string;
  }[];
}

export const diveConstant: { name: string; value: DiveTypeEnum }[] = [
  {
    name: 'Ngày công chuẩn',
    value: DiveTypeEnum.STANDARD,
  },
  {
    name: 'Tuỳ chọn',
    value: DiveTypeEnum.OTHER,
  },
];

export const recipesConstant: { name: string; value: SalaryTypeEnum }[] = [
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

export const referencesTypeConstant: RefernceType[] = [
  {
    name: 'Đơn giá',
    value: salaryReference.PRICE,
    dives: diveConstant,
  },
  {
    name: 'Loại lương',
    value: salaryReference.BLOCK,
    dives: diveConstant,
    recipes: recipesConstant,
  },
];
