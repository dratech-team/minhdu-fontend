import { BaseOrderEntity } from './base-order.entity';
import { RouteEntity } from '../../route/entities';
import { OrderHistoryEntity } from './order-history.entity';

export interface OrderEntity extends BaseOrderEntity {
  commodityTotal: number;
  priceTotal: number;
  expand: boolean;
  routes: RouteEntity[];
  orderHistories: OrderHistoryEntity[];
}
