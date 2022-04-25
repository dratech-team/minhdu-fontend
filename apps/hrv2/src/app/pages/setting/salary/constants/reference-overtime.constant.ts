import {RefernceType} from "./reference-absent.constant";
import {PriceType} from "../enums";

export const ReferenceOvertimeConstant: RefernceType [] = [
  {
    name: 'Đơn giá',
    value: PriceType.PRICE,
  },
  {
    name: 'Lương chuẩn',
    value: PriceType.STANDARD,
  },
];


