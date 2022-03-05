import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Commodity } from '../../commodity/+state/commodity.interface';
import { Route } from '../../route/+state/route.interface';
import { District, PaymentHistory, Province, ResponsePaginate, Ward } from '@minhdu-fontend/data-models';
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


export interface CommodityUniq {
  code: string,
  name: string,
  amount: number
}

export interface ResponsePaginateOrder<T> extends ResponsePaginate<T> {
  commodityUniq: CommodityUniq[]
}

export interface OrderHistory {
  id: number,
  orderId: number,
  type: string,
  note: string,
  timestamp: Date
}
