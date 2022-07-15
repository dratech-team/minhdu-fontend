import { BaseEntity } from '@minhdu-fontend/base-entity';
import { OrderEntity } from '../../order/enitities/order.entity';

export interface BaseRouteEntity extends BaseEntity {
  readonly name: string;
  readonly startedAt: Date | string;
  readonly endedAt: Date | string | null;
  readonly orders: OrderEntity[];
  readonly bsx: string;
}
