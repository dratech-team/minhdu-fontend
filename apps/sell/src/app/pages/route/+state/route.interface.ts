import { Employee } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/entities/order.entity';

export interface Route {
  id: number,
  name: string,
  startedAt: Date,
  endedAt: Date,
  driver: string,
  employee: Employee,
  orders: OrderEntity[],
  garage: string,
  bsx: string,
  latitude: string,
  longitude: string,
  isSelect?: boolean,
  totalCommodityUniq: number
}
