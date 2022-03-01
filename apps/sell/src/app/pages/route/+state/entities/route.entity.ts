import {Employee} from "@minhdu-fontend/data-models";
import {Order} from "../../../order/+state/order.interface";

export interface Route {
  id: number,
  name: string,
  startedAt: Date,
  endedAt: Date,
  driver: string,
  employee: Employee,
  orders: Order[],
  garage: string,
  bsx: string,
  latitude: string,
  longitude: string,
  isSelect?: boolean,
  totalCommodityUniq: number
}
