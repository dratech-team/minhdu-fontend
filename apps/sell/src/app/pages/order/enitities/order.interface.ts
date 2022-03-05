import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Commodity } from '../../commodity/+state/commodity.interface';
import { Route } from '../../route/+state/route.interface';
import { District, PaymentHistory, Province, Ward } from '@minhdu-fontend/data-models';
import { CustomerEntity } from '../../customer/entities/customer.interface';

export interface OrderEntity {
  id: number;
  customer: CustomerEntity;
  createdAt: Date;
  explain: string;
  commodityTotal: number;
  paymentTotal: number;
  deliveredAt: Date;
  commodities: Commodity[];
  currency: CurrencyUnit;
  routes: Route[];
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
  expand?: boolean,
  paymentHistories: PaymentHistory[];
}
