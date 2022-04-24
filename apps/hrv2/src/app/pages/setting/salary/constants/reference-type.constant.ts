import {salaryReference} from "../enums";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {DiveEnum} from "../enums/dive.enum";

export interface RefernceType {
  name: string,
  value: salaryReference,
  dives?: {
    name: string,
    value: DiveEnum
  }[],
  recipes?: {
    name: string,
    value: string
  } []
}

const diveConstant: { name: string; value: DiveEnum }[] = [
  {
    name: 'Ngày công chuẩn',
    value: DiveEnum.STANDARD
  },
  {
    name: 'Tuỳ chọn',
    value: DiveEnum.OTHER
  }
]

export const recipesConstant = [
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
]

export const referencesTypeConstant: RefernceType [] = [
  {
    name: 'Đơn giá',
    value: salaryReference.PRICE,
    dives: diveConstant,
  },
  {
    name: 'Loại lương',
    value: salaryReference.BLOCK,
    dives: diveConstant,
    recipes: recipesConstant
  },
];


