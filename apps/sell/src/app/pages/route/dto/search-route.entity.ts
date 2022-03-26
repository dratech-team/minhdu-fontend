import { SearchRangeDto } from '../../../shared/dto';

export interface SearchRouteEntity extends SearchRangeDto {
  search: string,
  status: number
}
