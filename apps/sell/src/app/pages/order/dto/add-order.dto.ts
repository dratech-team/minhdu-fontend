import { OrderEntity } from '../enitities/order.interface';
import { CustomerEntity } from '../../customer/entities/customer.entity';
import {CommodityEntity} from "../../commodity/entities/commodity.entity";

export interface AddOrderDto extends Pick<OrderEntity, 'createdAt' | 'endedAt' | 'explain'> {
  readonly customerId: CustomerEntity['id'];
  readonly createdAt: Date;
  readonly provinceId: number;
  readonly districtId?: number;
  readonly wardId?: number;
  readonly note?: string;
  readonly commodityIds?: CommodityEntity['id'][];
}
