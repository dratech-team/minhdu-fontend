import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';


export interface Payment {
  id: number,
  paidAt: Date,
  currency: CurrencyUnit,
  payType: PaymentType,
  total: number,
  customerId: number,
  note: String,
  orderId: number,
  order: {
    id: number
  }
}
