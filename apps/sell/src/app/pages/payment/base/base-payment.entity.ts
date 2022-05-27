import {PaymentType} from '@minhdu-fontend/enums';
import {BaseEntity} from "@minhdu-fontend/base-entity";


export interface BasePaymentEntity extends BaseEntity{
  paidAt: Date,
  payType: PaymentType,
  total: number,
  note: string,
}
