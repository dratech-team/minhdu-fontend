import { BasePaymentEntity } from '../base/base-payment.entity';
import { CurrencyUnit } from '@minhdu-fontend/enums';
import { CustomerEntity } from '../../customer/entities';
import { OrderEntity } from '../../order/enitities/order.entity';

export interface PaymentEntity extends BasePaymentEntity {
  order: OrderEntity;
  currency: CurrencyUnit;
  customer: CustomerEntity;
  createdAt: Date;
}
