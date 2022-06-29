import { BaseOrderEntity } from './base-order.entity';
import { District, PaymentHistory, Ward } from '@minhdu-fontend/data-models';
import { PaymentType } from '@minhdu-fontend/enums';

export interface OrderEntity extends BaseOrderEntity {
  hiddenDebt: boolean;
  totalCommodity: number;
  expand: boolean;
  paymentHistories: PaymentHistory[];
  customerId: number;
  explain: string;
  paidAt?: Date;
  payType?: PaymentType;
  paidTotal?: number;
  debt: number;
  district?: District;
  ward?: Ward;
  isSelect?: boolean;
}
