import { District, Province, Ward } from '@minhdu-fontend/data-models';
import { BaseCustomerEntity } from './base-customer.entity';
import { PaymentEntity } from '../../payment/entities';
import { BaseOrderEntity } from '../../order/enitities';

export interface CustomerEntity extends BaseCustomerEntity {
  readonly province: Province;
  readonly district: District;
  readonly ward: Ward;
  readonly delivered: BaseOrderEntity[];
  readonly delivering: BaseOrderEntity[];
  readonly paymentHistories?: PaymentEntity[];
}
