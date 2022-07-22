import { BaseRouteEntity } from './base-route-entity';
import { OrderEntity } from '../../order/enitities/order.entity';

export interface RouteEntity extends Omit<BaseRouteEntity, 'commodities'> {
  isSelect?: boolean;
  readonly totalCommodity: number;
  readonly expand: boolean;
  readonly commodityUniq: {
    code: string,
    name: string,
    amount: number,
  }[];
  readonly orders: OrderEntity[];
  readonly status: string;
}
