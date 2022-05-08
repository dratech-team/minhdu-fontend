import {RequireOnlyOne} from "../../../../../shared/types";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";
import {AllowanceSalaryEntity} from "../../../salary/entities";

export interface ModalAllowanceBranchData {
  add?: {
    branch: BranchEntity
  }
  update?: {
    allowance: AllowanceSalaryEntity
  }
}

export type DataAddOrUpAllowanceBranch = RequireOnlyOne<ModalAllowanceBranchData, 'add' | 'update'>
