import {CurrencyUnit, PaymentType} from '@minhdu-fontend/enums';
import {RouteEntity} from '../../route/entities/route.entity';
import {District, PaymentHistory, Province, Ward} from '@minhdu-fontend/data-models';
import {CustomerEntity} from '../../customer/entities';
import {CommodityEntity} from '../../commodity/entities';

export interface OrderEntity {
  customerId: number;
  id: number;
  customer: CustomerEntity;
  createdAt: Date;
  explain: string;
  commodityTotal: number;
  paymentTotal: number;
  deliveredAt: Date;
  commodities: CommodityEntity[];
  currency: CurrencyUnit;
  routes: RouteEntity[];
  paidAt?: Date;
  payType?: PaymentType;
  paidTotal?: number;
  debt: number;
  province?: Province;
  district?: District;
  ward?: Ward;
  isSelect?: boolean;
  endedAt: Date;
  hide: boolean;
  totalCommodity: number,
  expand: boolean,
  paymentHistories: PaymentHistory[];
}
