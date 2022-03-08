import { OrderEntity } from '../enitities/order.interface';
import { AddOrderDto } from './add-order.dto';
import {CommodityEntity} from "../../commodity/entities/commodity.entity";

export interface UpdateOrderDto extends Partial<AddOrderDto> {
  readonly orderIds?: OrderEntity['id'][],
  readonly commodityIds?: CommodityEntity['id'][],
  readonly deliveredAt?: Date,
}
