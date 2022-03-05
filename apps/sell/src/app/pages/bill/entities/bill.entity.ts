import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Commodity } from '../../commodity/+state/commodity.interface';
import { CustomerEntity } from '../../customer/entities/customer.interface';

export interface Bill {
  id: number,
  customer: CustomerEntity,
  customerId: number,
  paidAt: Date,
  createdAt: Date,
  explain: string,
  currency: CurrencyUnit,
  paidTotal: number,
  payType: PaymentType,
  commodities: Commodity,
  debt: number,
}
