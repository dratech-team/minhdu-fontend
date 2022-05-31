import {PaymentEntity} from "../../payment/entities/payment.entity";
import {CustomerEntity} from "../entities";
import {RequireOnlyOne} from "../../../../../../hrv2/src/shared/types";

export interface ModalPaymentData{
  add?:{
    customer: CustomerEntity
  }
  update?: {
    payment: PaymentEntity
  }
}
export type ModalAddOrUpdatePayment = RequireOnlyOne<ModalPaymentData, 'add' | 'update'>
