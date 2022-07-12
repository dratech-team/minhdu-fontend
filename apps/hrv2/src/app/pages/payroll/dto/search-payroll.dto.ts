import { BasePayrollEntity } from '../bases';
import {
  EmployeeStatusEnum,
  EmployeeType,
  FilterTypeEnum,
  SearchTypeEnum,
} from '@minhdu-fontend/enums';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { ConfirmStatus, PaidStatus } from '../enums';

export interface BaseSearchPayrollDto extends Partial<BasePayrollEntity> {
  readonly name?: string;
  readonly code?: string;
  readonly unit?: string;
  readonly branch?: string;
  readonly department?: string;
  readonly position?: string;
  readonly filterType?: FilterTypeEnum;
  readonly titles?: string[];
  readonly searchType?: SearchTypeEnum;
  readonly employeeId?: number;
  readonly startedAt: Date;
  readonly endedAt: Date;
  readonly empStatus: EmployeeStatusEnum;
  readonly employeeType: EmployeeType;
  readonly accConfirmed?: ConfirmStatus;
  readonly manConfirmedAt?: ConfirmStatus;
  readonly paidAt?: PaidStatus;
}

export type SearchPayrollDto = BaseSearchDto<BaseSearchPayrollDto>;
