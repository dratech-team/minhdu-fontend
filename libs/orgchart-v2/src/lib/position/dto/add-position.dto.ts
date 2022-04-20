import {BasePositionEntity} from "../bases";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddPositionDto extends BasePositionEntity {
  branchIds?: number [],
}

export type AddPositionDto = BaseAddDto<BaseAddPositionDto>
