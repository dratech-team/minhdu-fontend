import {CommodityUnit} from '@minhdu-fontend/enums';
import {Order} from '../../order/+state/order.interface';
import {Route} from "../../route/+state/route.interface";

export interface Commodity {
  id: number
  code: string
  name: string
  unit: CommodityUnit,
  price: number
  amount: number
  orders: Order[]
  isSelect: boolean;
  gift: number;
  more: {
    amount: number,
    price: number,
  },
  closed: boolean,
  routeId?: number
  route?: Route
}

export interface CommodityDTO {
  take?: number,
  skip?: number,
  orderId?: number,
  code?: string,
  name?: string,
  unit?: string
}
