import {District, PaymentHistory, Province, Ward} from '@minhdu-fontend/data-models';
import {BaseCustomerEntity} from './base-customer.entity';
import {OrderEntity} from "../../order/enitities/order.entity";

export interface CustomerEntity extends BaseCustomerEntity {
  readonly province: Province;
  readonly district: District;
  readonly ward: Ward;
  readonly delivered: OrderEntity[];
  readonly delivering: OrderEntity[];
  readonly paymentHistories?: PaymentHistory[];
}
