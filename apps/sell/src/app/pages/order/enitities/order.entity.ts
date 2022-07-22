import { BaseOrderEntity } from './base-order.entity';
import { District, PaymentHistory, Ward } from '@minhdu-fontend/data-models';
import { PaymentType } from '@minhdu-fontend/enums';

export interface OrderEntity extends BaseOrderEntity {
  totalCommodity: number;
  expand: boolean;
}
