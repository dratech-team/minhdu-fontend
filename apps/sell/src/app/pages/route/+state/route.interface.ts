import { Employee } from '@minhdu-fontend/data-models';
import { Order } from '../../order/+state/order.interface';
import { PaymentType } from '@minhdu-fontend/enums';
import { FormControl } from '@angular/forms';

export interface Route {
  id: number,
  name: string,
  startedAt: Date,
  endedAt: Date,
  driver: string,
  employee: Employee,
  orders: Order[],
  garage: string,
  bsx: string,
  latitude: string,
  longitude: string,
  isSelect?: boolean,
  totalCommodityUniq: number,
  orderIds?: number [],
  commodityIds?: number [],
}
