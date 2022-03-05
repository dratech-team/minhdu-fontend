
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Customer } from 'apps/sell/src/app/pages/customer/+state/customer.interface';

export interface PaymentHistory {
  id: number;
  paidAt: Date;
  currency?: CurrencyUnit;
  payType?: PaymentType;
  total: number;
  customer: Customer;
  customerId: number;
  orders: any[];
  note: String;
}
