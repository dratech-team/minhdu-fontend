import {BasePaymentEntity} from "../base/base-payment.entity";
import {BaseAddDto, BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdatePaymentDto extends Omit<BasePaymentEntity, 'id'> {
  customerId: number,
  orderId: number
}

export type UpdatePaymentDto = BaseUpdateDto<BaseUpdatePaymentDto>
