import {BaseBranchEntity} from "../bases";
import {RecipeType} from "@minhdu-fontend/enums";
import {PositionEntity} from "../../position/entities/position.entity";
import {AllowanceSalaryEntity} from "../../../../../../apps/hrv2/src/app/pages/salary/entities";

export interface BranchEntity extends BaseBranchEntity {
  recipe: RecipeType,
  _count?: {
    employees: number,
    employeeLeft: number
  },
  allowances?: AllowanceSalaryEntity [],
  positions?: PositionEntity[],
  phone?: string,
  address?: string,
  status?: boolean,
}
