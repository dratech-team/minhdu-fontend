import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Customer } from '../../../customer/+state/customer.interface';
import { Commodity } from '../../../commodity/container/+state/commodity.interface';

export interface Order {
  id : number,
  customer : Customer,
  customerId :number,
  paidAt : Date,
  createdAt : Date,
  explain: string,
  currency : CurrencyUnit,
  paidTotal: number,
  payType: PaymentType,
  commodities: Commodity,
}
