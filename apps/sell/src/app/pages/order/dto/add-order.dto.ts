import { BaseOrderEntity } from '../enitities/base-order.entity';
import { CommodityEntity } from '../../commodity/entities/commodity.entity';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export interface BaseAddOrderDto extends Partial<BaseOrderEntity> {
  readonly createdAt: Date;
  readonly provinceId: number;
  readonly districtId?: number;
  readonly wardId?: number;
  readonly note?: string;
  readonly commodityIds?: CommodityEntity['id'][];
}
export type AddOrderDto = BaseAddDto<BaseAddOrderDto>;
