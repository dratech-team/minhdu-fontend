import {BaseBranchEntity} from "../bases";
import {RecipeType} from "@minhdu-fontend/enums";
import {PositionEntity} from "../../position/entities/position.entity";
import {
  AllowanceBranchEntity
} from "../../../../../../apps/hrv2/src/app/pages/orgchart/branch/entities/allowance-branch.entity";

export interface BranchEntity extends BaseBranchEntity {
  recipe: RecipeType,
  _count?: {
    employees: number,
    employeeLeft: number
  },
  allowances?: AllowanceBranchEntity [],
  positions?: PositionEntity[],
  phone?: string,
  address?: string,
  status?: boolean,
}
