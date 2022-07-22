import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { RouteEntity } from '../../route/entities';
import { District, PaymentHistory, Province, Ward } from '@minhdu-fontend/data-models';
import { CustomerEntity } from '../../customer/entities';
import { CommodityEntity } from '../../commodity/entities';
import { BaseEntity } from '@minhdu-fontend/base-entity';

export interface BaseOrderEntity extends BaseEntity {
  customer: CustomerEntity;
  createdAt: Date;
  priceTotal: number;
  paymentTotal: number;
  deliveredAt?: Date | null;
  commodities: CommodityEntity[];
  currency: CurrencyUnit;
  routes: RouteEntity[];
  province: Province;
  endedAt: Date;
  paymentHistories: PaymentHistory[];
  customerId: number;
  explain: string;
  paidAt?: Date;
  payType?: PaymentType;
  paidTotal?: number;
  debt: number;
  district?: District;
  ward?: Ward;
  hiddenDebt: boolean;
}
