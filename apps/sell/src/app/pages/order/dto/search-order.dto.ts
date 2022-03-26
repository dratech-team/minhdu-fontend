import { PaidType } from '@minhdu-fontend/enums';
import { SearchRangeDto } from '../../../shared/dto/search-range.dto';

export interface SearchOrderDto extends SearchRangeDto {
  search: string,
  paidType: PaidType | '',
  customer: string,
  status: number,
  explain: string,
  commodityTotal?: number,
  province?: string,
  bsx?: string,
  commodity?: string
}
