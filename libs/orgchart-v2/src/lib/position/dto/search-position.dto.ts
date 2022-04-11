import {BasePositionEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchPositionDto extends BasePositionEntity {
  orderBy?: string,
  orderType?: string,
}

export type SearchPositionDto = BaseSearchDto<BaseSearchPositionDto>
