import {BaseAllowanceBranchEntity} from "../base/base-allowance-branch.entity";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdateAllowanceBranchDto extends BaseAllowanceBranchEntity {
  branchId: number
}

export type UpdateAllowanceBranchDto = BaseUpdateDto<BaseUpdateAllowanceBranchDto>
