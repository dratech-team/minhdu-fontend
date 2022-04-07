import {BaseConsignmentEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchConsignmentDto extends BaseConsignmentEntity {
}

export type SearchConsignmentDto = BaseSearchDto<BaseSearchConsignmentDto>
