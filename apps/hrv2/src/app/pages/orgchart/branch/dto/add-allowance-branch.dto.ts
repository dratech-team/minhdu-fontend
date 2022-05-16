import {BaseAllowanceBranchEntity} from "../base/base-allowance-branch.entity";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddAllowanceBranchDto extends BaseAllowanceBranchEntity{
  branchId: number
}

export type AddAllowanceBranchDto = BaseAddDto<BaseAddAllowanceBranchDto>
