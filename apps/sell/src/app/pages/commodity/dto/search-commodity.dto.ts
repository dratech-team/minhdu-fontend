import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { BaseCommodityEntity } from '../entities';

interface BaseSearchCommodityDto extends BaseCommodityEntity {
  readonly closed: boolean;
}

export interface SearchCommodityDto extends BaseSearchDto<BaseSearchCommodityDto> {
}
