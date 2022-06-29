import { SearchRangeDto } from '../../../shared/dto';

export interface SearchRouteDto extends SearchRangeDto {
  search?: string;
  status?: number;
  take?: number;
  skip?: number;
  orderId?: number;
  orderType?: string;
  orderBy?: string;
}
