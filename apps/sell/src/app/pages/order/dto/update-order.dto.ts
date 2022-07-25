import { CommodityEntity } from '../../commodity/entities';
import { BaseOrderEntity, OrderEntity } from '../enitities';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdateOrderDto extends BaseOrderEntity {
  readonly orderIds?: OrderEntity['id'][];
  readonly commodityIds?: CommodityEntity['id'][];
}

export interface UpdateOrderDto extends BaseUpdateDto<BaseUpdateOrderDto> {
  inRoute?: { routeId: number };
}
