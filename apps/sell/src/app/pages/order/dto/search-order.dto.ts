import { PaidType, StatusOrder } from '@minhdu-fontend/enums';
import { SearchRangeDto } from '../../../shared/dto';
import { OrderStatusEnum } from '../enums';

export interface SearchOrderDto extends SearchRangeDto {
  readonly take?: number;
  readonly skip?: number;
  readonly customerId?: number;
  status?: OrderStatusEnum;
  orderBy?: string;
  orderType?: string;
  search?: string;
  paidType?: PaidType | '';
  customer?: string;
  explain?: string;
  commodityTotal?: number;
  province?: string;
  bsx?: string;
  commodity?: string;
  hiddenDebt?: StatusOrder;
}
