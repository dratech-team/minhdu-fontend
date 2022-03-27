import { OrderEntity } from '../../order/enitities';
import { RouteEntity } from '../../route/entities';
import { BaseCommodityEntity } from './base-commodity.entity';

export interface CommodityEntity extends BaseCommodityEntity {
  orders: OrderEntity[]
  isSelect: boolean;
  gift: number;
  more: {
    amount: number,
    price: number,
  },
  closed: boolean,
  routeId?: number
  route?: RouteEntity,
  orderId?: number
}


