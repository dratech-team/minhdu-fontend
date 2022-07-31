import { BaseOrderEntity } from './base-order.entity';
import { RouteEntity } from '../../route/entities';

export interface OrderEntity extends BaseOrderEntity {
  expand?: boolean;
  routes: RouteEntity[];
  commodityTotal: number;
}
