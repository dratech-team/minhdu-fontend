import {BaseEntity} from "@minhdu-fontend/base-entity";
import {OrderEntity} from "../../order/enitities/order.entity";

export interface BaseRouteEntity extends BaseEntity{
  readonly name: string,
  readonly startedAt: Date,
  readonly endedAt: Date,
  readonly orders: OrderEntity[],
  readonly bsx: string,
}
