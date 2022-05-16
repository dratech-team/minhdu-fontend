import {BaseAllowanceBranchEntity} from "../base/base-allowance-branch.entity";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";

export interface AllowanceBranchEntity extends BaseAllowanceBranchEntity {
  branch:BranchEntity
}
