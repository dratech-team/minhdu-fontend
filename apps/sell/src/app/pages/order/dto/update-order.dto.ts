import { OrderEntity } from '../enitities/order.interface';
import { AddOrderDto } from './add-order.dto';
import { Commodity } from '../../commodity/+state/commodity.interface';

export interface UpdateOrderDto extends Partial<AddOrderDto> {
  readonly orderIds?: OrderEntity['id'][],
  readonly commodityIds?: Commodity['id'][],
  readonly deliveredAt?: Date,
}
