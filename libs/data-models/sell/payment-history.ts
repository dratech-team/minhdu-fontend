import { CurrencyUnit, PaymentType } from '../../enums';
import { Customer } from '../../../apps/sell/src/app/pages/customer/+state/customer.interface';
import { Order } from '@datorama/akita';

export interface PaymentHistory {
  id: number;
  paidAt: Date;
  currency?: CurrencyUnit;
  payType?: PaymentType;
  total: number;
  customer: Customer;
  customerId: number;
  orders: Order;
  note: String;
}
