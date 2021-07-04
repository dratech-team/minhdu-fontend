import { CurrencyUnit } from '@minhdu-fontend/enums';
import { Customer } from '../../../apps/sell/src/app/pages/customer/container/+state/customer.interface';
export interface Order{
  id: number,
  customer: Customer;
  customerId: number,
  paidAt: Date,
  createdAt: Date,
  explain: string,
  currency: CurrencyUnit;
}
