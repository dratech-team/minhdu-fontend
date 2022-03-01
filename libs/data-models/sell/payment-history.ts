
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { CustomerEntity } from 'apps/sell/src/app/pages/customer/entities/customer.entity';

export interface PaymentHistory {
  id: number;
  paidAt: Date;
  currency?: CurrencyUnit;
  payType?: PaymentType;
  total: number;
  customer: CustomerEntity;
  customerId: number;
  orders: any[];
  note: String;
}
