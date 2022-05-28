import {PaymentType} from "@minhdu-fontend/enums";

export const PayTypeConstant = [
  {
    name: 'Tiền mặt',
    value: PaymentType.CASH
  },
  {
    name: 'Chuyển khoản',
    value: PaymentType.TRANSFER
  },
  {
    name: 'Tất cả',
    value: PaymentType.ALL
  },
]
