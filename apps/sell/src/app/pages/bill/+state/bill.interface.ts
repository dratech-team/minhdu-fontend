import { Customer } from '../../customer/+state/customer/customer.interface';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Commodity } from '../../commodity/entities/commodity.entity';

export interface Bill{
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
  debt: number,
}