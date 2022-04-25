import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {salariesConstant} from "../constants";

export const transFormTotalOf =(totalOf: SalaryTypeEnum[]) =>{
  return '('+ totalOf.map(val => {
    return  salariesConstant.find((item: any) => item.value === val)?.name
  }).join(' + ') +')'
}
