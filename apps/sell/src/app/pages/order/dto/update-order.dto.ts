import { OrderEntity } from '../entities/order.entity';

export interface UpdateOrderDto {
  order?: Partial<OrderEntity>,
  id: number
  commodityIds?: number[];
  typeUpdate?: 'DELIVERED' | 'IN_CUSTOMER',
}
