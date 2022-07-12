import { SearchRangeDto } from '../../../shared/dto';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';

export interface BaseSearchRouteDto extends SearchRangeDto {
  search?: string;
  status?: number;
  orderId?: number;
  orderType?: string;
  orderBy?: string;
}

export type SearchRouteDto = BaseSearchDto<BaseSearchRouteDto>;
