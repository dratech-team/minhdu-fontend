import { Employee } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/enitities/order.interface';
import { PaymentType } from '@minhdu-fontend/enums';
import { FormControl } from '@angular/forms';

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
  totalCommodityUniq: number,
  orderIds?: number [],
  commodityIds?: number [],
}
