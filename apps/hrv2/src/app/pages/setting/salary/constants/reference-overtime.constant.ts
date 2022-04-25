import {recipesConstant, RefernceType} from "./reference.constant";
import {PriceType} from "../enums";

export const ReferenceOvertimeConstant: RefernceType [] = [
  {
    name: 'Đơn giá',
    value: PriceType.PRICE,
  },
  {
    name: 'Loại lương',
    value: PriceType.BLOCK,
    recipes: recipesConstant
  },
  {
    name: 'Lương chuẩn',
    value: PriceType.STANDARD,
  },
];


