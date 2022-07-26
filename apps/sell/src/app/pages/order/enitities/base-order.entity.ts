import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { District, PaymentHistory, Province, Ward } from '@minhdu-fontend/data-models';
import { CustomerEntity } from '../../customer/entities';
import { CommodityEntity } from '../../commodity/entities';
import { BaseEntity } from '@minhdu-fontend/base-entity';
import { OrderHistoryEntity } from './order-history.entity';

export interface BaseOrderEntity extends BaseEntity {
  customer: CustomerEntity;
  createdAt: Date;
  cancelledAt: Date;
  priceTotal: number;
  paymentTotal: number;
  deliveredAt?: Date | null;
  commodities: CommodityEntity[];
  currency: CurrencyUnit;
  endedAt: Date;
  paymentHistories: PaymentHistory[];
  customerId: number;
  explain: string;
  paidAt?: Date;
  payType?: PaymentType;
  paidTotal?: number;
  debt: number;
  province: Province;
  district?: District;
  ward?: Ward;
  hide: boolean;
  orderHistories: OrderHistoryEntity[];
}
