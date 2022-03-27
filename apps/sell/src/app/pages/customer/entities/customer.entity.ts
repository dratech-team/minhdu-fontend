import { District, PaymentHistory, Province, Ward } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/enitities';
import { BaseCustomerEntity } from './base-customer.entity';

export interface CustomerEntity extends BaseCustomerEntity {
  readonly province: Province;
  readonly district: District;
  readonly ward: Ward;
  readonly delivered: OrderEntity[];
  readonly delivering: OrderEntity[];
  readonly paymentHistories?: PaymentHistory[];
}
