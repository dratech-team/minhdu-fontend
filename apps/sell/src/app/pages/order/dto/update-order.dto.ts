import { CommodityEntity } from '../../commodity/entities';
import { OrderEntity } from '../enitities/order.entity';
import { BaseOrderEntity } from '../enitities';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

interface BaseUpdateOrderDto extends BaseOrderEntity {
  readonly orderIds?: OrderEntity['id'][];
  readonly commodityIds?: CommodityEntity['id'][];
}

export interface UpdateOrderDto extends BaseUpdateDto<BaseUpdateOrderDto> {
  inRoute?: { routeId: number };
}
