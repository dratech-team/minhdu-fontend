import {BaseBranchEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdateBranchDto extends BaseBranchEntity {
  positionIds?: number [],
}

export type UpdateBranchDto = BaseUpdateDto<BaseUpdateBranchDto>
