import { BasePaymentEntity } from '../base/base-payment.entity';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdatePaymentDto extends Omit<BasePaymentEntity, 'id'> {
  orderId: number;
}

export type UpdatePaymentDto = BaseUpdateDto<BaseUpdatePaymentDto>;
