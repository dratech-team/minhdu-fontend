
import { Employee,  } from '@minhdu-fontend/data-models';
import { Order } from '../../../order/container/+state/order.interface';

export interface Route {
  id: number,
  name: string,
  startedAt: Date,
  endedAt: Date,
  driver: Employee,
  employeeId: number,
  orders: Order[],
  bsx: string,
  latitude: number,
  longitude: number,
}
