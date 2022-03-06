import {RouteEntity} from "../entities/route.entity";

export interface UpdateRouteDto extends Omit<RouteEntity, 'id'>{
  readonly orderIds?: number [],
  readonly commodityIds?:number []
}
