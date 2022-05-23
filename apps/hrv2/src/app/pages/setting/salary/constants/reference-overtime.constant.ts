import {salariesConstant, recipeType} from "./recipes.constant";
import {PriceType} from "../enums";

export const ReferenceOvertimeConstant: recipeType [] = [
  {
    name: 'Đơn giá',
    value: PriceType.PRICE,
  },
  {
    name: 'Loại lương',
    value: PriceType.BLOCK,
    salariesConstant: salariesConstant
  },
  {
    name: 'Lương chuẩn',
    value: PriceType.STANDARD,
  },
];


