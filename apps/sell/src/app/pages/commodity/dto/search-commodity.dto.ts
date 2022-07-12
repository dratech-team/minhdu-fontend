import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { BaseCommodityEntity } from '../entities';

export interface BaseSearchCommodityDto extends Partial<Omit<BaseCommodityEntity, 'id'>> {
  readonly closed?: boolean;
}

export interface SearchCommodityDto
  extends BaseSearchDto<BaseSearchCommodityDto> {}
