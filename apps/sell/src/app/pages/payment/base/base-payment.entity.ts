import {PaymentType} from '@minhdu-fontend/enums';
import {BaseEntity} from "@minhdu-fontend/base-entity";
import {CustomerEntity} from "../../customer/entities";


export interface BasePaymentEntity extends BaseEntity{
  paidAt: Date,
  payType: PaymentType,
  total: number,
  note: string,
  customerId: CustomerEntity['id']
  orderId: number
}
