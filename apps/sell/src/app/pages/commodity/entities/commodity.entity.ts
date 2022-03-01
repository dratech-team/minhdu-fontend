import { CommodityUnit } from '@minhdu-fontend/enums';
import { OrderEntity } from '../../order/entities/order.entity';

export interface Commodity {
  id: number
  code: string
  name: string
  unit: CommodityUnit,
  price: number
  amount: number
  orders: OrderEntity[]
  gift: number;
  more: {
    amount: number,
    price: number,
  },
  closed: boolean,
}

export interface CommodityDTO {
  take?: number,
  skip?: number,
  orderId?: number,
  code?: string,
  name?: string,
  unit?: string
}
