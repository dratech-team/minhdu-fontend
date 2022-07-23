import { BaseOrderEntity } from './base-order.entity';
import { RouteEntity } from '../../route/entities';

export interface OrderEntity extends BaseOrderEntity {
  totalCommodity: number;
  expand: boolean;
  routes: RouteEntity[];
}
