import { PaymentEntity } from '../../payment/entities';
import { CustomerEntity } from '../entities';
import { OrderEntity } from '../../order/enitities';
import { RequireOnlyOne } from '@minhdu-fontend/types';

export interface ModalPaymentData {
  add?: {
    customer: CustomerEntity;
    order?: OrderEntity
  };
  update?: {
    payment: PaymentEntity;
  };
}

export type ModalAddOrUpdatePayment = RequireOnlyOne<ModalPaymentData,
  'add' | 'update'>;
