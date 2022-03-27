import { OrderEntity } from '../enitities/order.entity';
import { AddOrderDto } from './add-order.dto';
import {CommodityEntity} from "../../commodity/entities/commodities/commodity.entity";

export interface UpdateOrderDto extends Partial<AddOrderDto> {
  readonly orderIds?: OrderEntity['id'][],
  readonly commodityIds?: CommodityEntity['id'][],
  readonly deliveredAt?: Date,
}
