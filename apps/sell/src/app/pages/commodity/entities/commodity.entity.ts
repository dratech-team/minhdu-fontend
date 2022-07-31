import { RouteEntity } from '../../route/entities';
import { BaseCommodityEntity } from './base-commodity.entity';
import { OrderEntity } from '../../order/enitities';

export interface CommodityEntity extends BaseCommodityEntity {
  order: OrderEntity;
  gift: number;
  more: {
    amount: number;
    price: number;
  } | null;
  closed: boolean;
  routeId?: number;
  route?: RouteEntity;
  orderId?: number;
}
