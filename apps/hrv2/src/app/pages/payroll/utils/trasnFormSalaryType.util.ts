import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {blockSalariesConstant} from "../../setting/salary/constants";

export const tranFormSalaryType = (salaryTypes: SalaryTypeEnum[]) => {
  return `(${salaryTypes.map(val => {
    return blockSalariesConstant.find((item: any) => item.type === val)?.title
  }).join(' + ')})`
}
