import {Employee} from "@minhdu-fontend/data-models";
import {OrderEntity} from "../../order/entities/order.entity";

export interface Route {
  readonly id: number,
  readonly name: string,
  readonly startedAt: Date,
  endedAt: Date,
  readonly driver: string,
  readonly employee?: Employee,
  readonly orders: OrderEntity[],
  readonly garage: string,
  readonly bsx: string,
  readonly latitude?: string,
  readonly longitude?: string,
  isSelect?: boolean,
  totalCommodityUniq?: number
}
