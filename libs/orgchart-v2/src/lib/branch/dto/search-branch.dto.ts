import {BaseBranchEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchBranchDto extends BaseBranchEntity {
  orderBy?: string,
  orderType?: string,
}

export type SearchBranchDto = BaseSearchDto<BaseSearchBranchDto>
