import {CurrencyUnit, PaymentType} from '@minhdu-fontend/enums';
import {CustomerEntity} from '../../customer/entities/customer.interface';
import {Commodity} from '../../commodity/+state/commodity.interface';
import {Route} from '../../route/+state/route.interface';
import {District, PaymentHistory, Province, ResponsePaginate, Ward} from '@minhdu-fontend/data-models';

export interface Order {
  id: number;
  customer: CustomerEntity;
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
  totalCommodity:number,
  expand?:boolean,
  commodityIds?: number[];
}

export interface UpdateOrderDto{
  order?: Partial<Order>,
  id: number
  typeUpdate?: 'DELIVERED' | 'IN_CUSTOMER',
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
  } | Date|string;
  status: 0 | 1;
  explain: string;
  ward: string;
  isRoute?:boolean
}

export interface CommodityUniq {
  code: string,
  name: string,
  amount: number
}

export interface ResponsePaginateOrder<T> extends ResponsePaginate<T> {
  commodityUniq: CommodityUniq[]
}

export interface OrderHistory{
  id: number,
  orderId:number,
  type: string,
  note: string,
  timestamp: Date
}
