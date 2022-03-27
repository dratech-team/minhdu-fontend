import { Employee } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/enitities/order.entity';

export interface RouteEntity {
  readonly id: number,
  readonly name: string,
  readonly startedAt: Date,
  readonly endedAt: Date,
  readonly driver: string,
  readonly employee: Employee,
  readonly orders: OrderEntity[],
  readonly garage: string,
  readonly bsx: string,
  readonly latitude: string,
  readonly longitude: string,
  isSelect?: boolean,
  readonly totalCommodityUniq: number,
  readonly expand: boolean
}
