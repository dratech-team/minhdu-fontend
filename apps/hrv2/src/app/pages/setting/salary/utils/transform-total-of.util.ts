import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {recipesConstant} from "../constants";

export const transFormTotalOf =(totalOf: SalaryTypeEnum[]) =>{
  return '('+ totalOf.map(val => {
    return  recipesConstant.find((item: any) => item.value === val)?.name
  }).join(' + ') +')'
}
