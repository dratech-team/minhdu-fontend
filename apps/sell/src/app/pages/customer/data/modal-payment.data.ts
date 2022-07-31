import { PaymentEntity } from '../../payment/entities';
import { CustomerEntity } from '../entities';
import { RequireOnlyOne } from '../../../../../../hrv2/src/shared/types';
import { OrderEntity } from '../../order/enitities';

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
