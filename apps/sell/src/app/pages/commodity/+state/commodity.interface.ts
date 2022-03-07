import {CommodityUnit} from '@minhdu-fontend/enums';
import {OrderEntity} from '../../order/enitities/order.interface';
import {RouteEntity} from "../../route/entities/route.entity";

export interface Commodity {
  id: number
  code: string
  name: string
  unit: CommodityUnit,
  price: number
  amount: number
  orders: OrderEntity[]
  isSelect: boolean;
  gift: number;
  more: {
    amount: number,
    price: number,
  },
  closed: boolean,
  routeId?: number
  route?: RouteEntity
}

export interface CommodityDTO {
  take?: number,
  skip?: number,
  orderId?: number,
  code?: string,
  name?: string,
  unit?: string
}
