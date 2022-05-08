import {BasePositionEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchPositionDto extends BasePositionEntity {
  orderBy?: string,
  orderType?: string,
  search?: string
}

export type SearchPositionDto = BaseSearchDto<BaseSearchPositionDto>
