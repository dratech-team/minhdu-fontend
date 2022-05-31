import {BasePaymentEntity} from "../base/base-payment.entity";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddPaymentDto extends Omit<BasePaymentEntity, 'id'> {
  orderId: number
}

export type AddPaymentDto = BaseAddDto<BaseAddPaymentDto>