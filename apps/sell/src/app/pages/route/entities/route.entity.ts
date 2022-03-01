import {Employee} from "@minhdu-fontend/data-models";
import {Order} from "../../order/+state/order.interface";

export interface Route {
  readonly id: number,
  readonly name: string,
  readonly startedAt: Date,
  endedAt: Date,
  readonly driver: string,
  readonly employee: Employee,
  readonly orders: Order[],
  readonly garage: string,
  readonly bsx: string,
  readonly latitude: string,
  readonly longitude: string,
  readonly isSelect?: boolean,
  totalCommodityUniq: number
}
