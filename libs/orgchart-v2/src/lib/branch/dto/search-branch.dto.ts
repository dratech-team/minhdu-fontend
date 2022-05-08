import {BaseBranchEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {PositionEntity} from "@minhdu-fontend/orgchart-v2";

export interface BaseSearchBranchDto extends BaseBranchEntity {
  orderBy?: string,
  orderType?: string,
  position?: PositionEntity
}

export type SearchBranchDto = BaseSearchDto<BaseSearchBranchDto>
