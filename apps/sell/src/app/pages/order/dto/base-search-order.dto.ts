import { PaidType, StatusOrder } from '@minhdu-fontend/enums';
import { SearchRangeDto } from '../../../shared/dto';
import { OrderStatusEnum } from '../enums';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';

export interface BaseSearchOrderDto extends SearchRangeDto {
  readonly customerId?: number;
  readonly status?: OrderStatusEnum;
  readonly orderBy?: string;
  readonly orderType?: string;
  readonly search?: string;
  readonly paidType?: PaidType | '';
  readonly customer?: string;
  readonly explain?: string;
  readonly commodityTotal?: number;
  readonly province?: string;
  readonly bsx?: string;
  readonly commodity?: string;
  readonly hiddenDebt?: StatusOrder;
}

export type SearchOrderDto = BaseSearchDto<BaseSearchOrderDto>
