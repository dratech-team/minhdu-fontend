import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Customer } from '../../customer/+state/customer/customer.interface';
import { Commodity } from '../../commodity/+state/commodity.interface';
import { Route } from '../../route/container/+state/route.interface';
import { PaymentHistory, Ward } from '@minhdu-fontend/data-models';

export interface Order {
  id : number,
  customer : Customer,
  customerId :number,
  createdAt : Date,
  explain: string,
  currency : CurrencyUnit,
  commodities: Commodity[],
  routes: Route[],
  paidAt?: Date,
  payType?:PaymentType,
  paidTotal?: number,
  debt: number,
  destination?: Ward,
  isSelect?: boolean,
  paymentHistories: PaymentHistory[];
  commodityTotal:number;
  paymentTotal: number;
  deliveredAt: Date;
  hide: boolean;
}
export interface OrderDTO {
  take?: number;
  skip?: number;
  paidType?: string;
  customerId?: number|string;
  routeId?: number;
  customer?: string;
  delivered?: number;
  explain?: string;
  createdAt?: Date;
  destination?: string
}
