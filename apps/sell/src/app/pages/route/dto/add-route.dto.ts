import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseRouteEntity} from "../entities/base-route-entity";

interface BaseAddRoute extends BaseRouteEntity {
  readonly orderIds: number[],
  readonly commodityIds: number[]
}

export type AddRouteDto = BaseAddDto<BaseAddRoute>

