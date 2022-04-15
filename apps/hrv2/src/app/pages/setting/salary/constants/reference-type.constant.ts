import {salaryReference} from "../enums";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface RefernceType {
  name: string,
  value: salaryReference,
  dives?: {
    name: string,
    value: 'STANDARD' | 'OTHER'
  }[],
  recipes?: {
    name: string,
    value: string
  } []
}

const diveConstant: { name: string; value: 'STANDARD' | 'OTHER' }[] = [
  {
    name: 'Ngày công chuẩn',
    value: 'STANDARD'
  },
  {
    name: 'Tuỳ chọn',
    value: 'OTHER'
  }
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
    recipes: [
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
  },
];


