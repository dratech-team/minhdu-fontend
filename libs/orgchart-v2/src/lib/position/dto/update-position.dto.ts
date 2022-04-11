import {BasePositionEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdatePositionDto extends BasePositionEntity {
  positionIds?: number [],
}

export type UpdatePositionDto = BaseUpdateDto<BaseUpdatePositionDto>
