import { PaidType } from '@minhdu-fontend/enums';
import { SearchRangeDto } from '../../../shared/dto';
import { HideDebtStatusEnum, OrderStatusEnum } from '../enums';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';

export interface BaseSearchOrderDto extends SearchRangeDto {
  readonly customerId?: number;
  readonly routeId?: number;
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
  readonly hiddenDebt?: HideDebtStatusEnum;
}

export type SearchOrderDto = BaseSearchDto<BaseSearchOrderDto>
