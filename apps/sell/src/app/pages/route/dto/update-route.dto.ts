import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {BaseRouteEntity} from "../entities/base-route-entity";

interface BaseUpdateRouteDto extends BaseRouteEntity {
  commodityIds?: number[]
}

export type UpdateRouteDto = BaseUpdateDto<BaseUpdateRouteDto>
