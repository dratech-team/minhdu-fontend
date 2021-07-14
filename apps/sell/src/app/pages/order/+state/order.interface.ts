import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Customer } from '../../customer/+state/customer.interface';
import { Commodity } from '../../commodity/+state/commodity.interface';
import { Route } from '../../route/container/+state/route.interface';

export interface Order {
  id : number,
  customer : Customer,
  customerId :number,
  createdAt : Date,
  explain: string,
  currency : CurrencyUnit,
  commodities: Commodity[],
  routes: Route[],
  paidAt?: Date,
  payType?:PaymentType,
  paidTotal?: number,
  debt: number,
}
