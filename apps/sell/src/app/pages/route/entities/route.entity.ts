import { BaseRouteEntity } from './base-route-entity';
import { OrderEntity } from '../../order/enitities';

export interface RouteEntity extends Omit<BaseRouteEntity, 'commodities'> {
  isSelect?: boolean;
  readonly expand: boolean;
}
