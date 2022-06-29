import { BaseCommodityEntity } from '../entities';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

interface BaseUpdateCommodityDto extends BaseCommodityEntity {
  readonly orderId: number;
  readonly closed: boolean;
  readonly histored?: boolean;
}

export interface UpdateCommodityDto
  extends BaseUpdateDto<BaseUpdateCommodityDto> {}
