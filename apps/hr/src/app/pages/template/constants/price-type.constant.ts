import {PriceTypeEnum} from "../enums";

export interface PriceType {
  name: string,
  value: PriceTypeEnum,
  days?: {
    name: string,
    value: 'STANDARD' | 'OTHER'
  }[]
}

const daysConstant: { name: string; value: 'STANDARD' | 'OTHER' }[] = [
  {
    name: 'Ngày công chuẩn',
    value: 'STANDARD'
  },
  {
    name: 'Tuỳ chọn',
    value: 'OTHER'
  }
]

export const PriceTypeConstant: PriceType [] = [
  {
    name: 'Đơn giá',
    value: PriceTypeEnum.INPUT,
  },
  {
    name: 'Lương chuẩn',
    value: PriceTypeEnum.STANDARD,
    days: daysConstant
  },
  {
    name: 'Lương cơ bản',
    value: PriceTypeEnum.BASIC,
    days: daysConstant
  },
  {
    name: 'Lương bảo hiểm',
    value: PriceTypeEnum.INSURANCE,
    days: daysConstant
  }
];


