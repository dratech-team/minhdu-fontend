import {BaseBranchEntity} from "../bases";
import {RecipeType} from "@minhdu-fontend/enums";
import {Position, Salary} from "@minhdu-fontend/data-models";
import {PositionEntity} from "../../position/entities/position.entity";

export interface BranchEntity extends BaseBranchEntity {
  recipe: RecipeType,
  _count?: {
    employees: number,
    employeeLeft: number
  },
  allowances?: Salary [],
  positions?: PositionEntity[],
  phone?: string,
  address?: string,
  status?: boolean,
}
