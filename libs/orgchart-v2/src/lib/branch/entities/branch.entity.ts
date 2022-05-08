import {BaseBranchEntity} from "../bases";
import {RecipeType} from "@minhdu-fontend/enums";
import {Position, Salary} from "@minhdu-fontend/data-models";

export interface BranchEntity extends BaseBranchEntity{
  recipe: RecipeType,
  _count?: {
    employees: number,
    employeeLeft: number
  },
  allowances?: Salary [],
  positions?: Position[],
  phone?: string,
  address?: string,
  status?: boolean,
}
