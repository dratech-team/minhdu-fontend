import {RequireOnlyOne} from "../../../../../shared/types";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";
import {AllowanceSalaryEntity} from "../../../salary/entities";
import {AllowanceBranchEntity} from "../entities/allowance-branch.entity";

export interface ModalAllowanceBranchData {
  add?: {
    branch: BranchEntity
  }
  update?: {
    allowance: AllowanceBranchEntity
  }
}

export type DataAddOrUpAllowanceBranch = RequireOnlyOne<ModalAllowanceBranchData, 'add' | 'update'>
