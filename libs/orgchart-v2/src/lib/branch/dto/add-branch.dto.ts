import {BaseBranchEntity} from "../bases";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddBranchDto extends BaseBranchEntity {
  positionIds?: number [],
}

export type AddBranchDto = BaseAddDto<BaseAddBranchDto>
