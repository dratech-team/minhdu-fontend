import { CustomerEntity } from '../../customer/entities/customer.entity';
import { Commodity } from '../../commodity/entities/commodity.entity';
import { Route } from '../../route/+state/route.interface';
import { District, PaymentHistory, Province, Ward } from '@minhdu-fontend/data-models';

export interface OrderEntity {
  id: number;
  customer: CustomerEntity;
  createdAt: Date;
  endedAt: Date;
  createdBy?: string;
  explain?: string;
  province?: Province;
  district?: District;
  ward?: Ward;
  hide: boolean;
  deliveredAt: Date;
  total?: number;
  canceledAt?: Date;
  note?: string;
  routes: Route[];
  commodities: Commodity[];
  paymentHistories: PaymentHistory[];
  debt: number;
  paymentTotal: number;
  commodityTotal: number;
  totalCommodity: number;
}

export interface CommodityUniq {
  code: string,
  name: string,
  amount: number
}

export interface OrderHistory {
  id: number,
  orderId: number,
  type: string,
  note: string,
  timestamp: Date
}
