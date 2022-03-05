import { OrderEntity } from '../enitities/order.interface';
import { CustomerEntity } from '../../customer/entities/customer.interface';
import { Commodity } from '../../commodity/+state/commodity.interface';

export interface AddOrderDto extends Pick<OrderEntity, 'createdAt' | 'endedAt' | 'explain'> {
  readonly customerId: CustomerEntity['id'];
  readonly createdAt: Date;
  readonly provinceId: number;
  readonly districtId?: number;
  readonly wardId?: number;
  readonly note?: string;
  readonly commodityIds?: Commodity['id'][];
}
