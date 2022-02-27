import {CurrencyUnit, PaymentType} from '@minhdu-fontend/enums';
import {Customer} from '../../customer/+state/customer/customer.interface';
import {Commodity} from '../../commodity/+state/commodity.interface';
import {Route} from '../../route/container/+state/route.interface';
import {District, PaymentHistory, Province, ResponsePaginate, Ward} from '@minhdu-fontend/data-models';

export interface Order {
  id: number;
  customer: Customer;
  customerId: number;
  createdAt: Date;
  explain: string;
  currency: CurrencyUnit;
  commodities: Commodity[];
  routes: Route[];
  paidAt?: Date;
  payType?: PaymentType;
  paidTotal?: number;
  debt: number;
  province?: Province;
  district?: District;
  ward?: Ward;
  isSelect?: boolean;
  paymentHistories: PaymentHistory[];
  commodityTotal: number;
  paymentTotal: number;
  deliveredAt: Date;
  endedAt: Date;
  hide: boolean;
}

export interface UpdateOrderDto extends Omit<Order, 'commodities'> {
  commodityIds: number[];
}

export interface OrderDTO {
  take: number;
  skip: number;
  paidType: string;
  customerId: number | string;
  routeId: number;
  customer: string;
  deliveredAt: {
    startedAt: Date,
    endedAt: Date,
  } | Date;
  createdAt: {
    startedAt: Date,
    endedAt: Date,
  } | Date;
  status: 0 | 1;
  explain: string;
  ward: string;
}

export interface CommodityUniq {
  code: string,
  name: string,
  amount: number
}

export interface ResponsePaginateOrder<T> extends ResponsePaginate<T> {
  commodityUniq: CommodityUniq[]
}
