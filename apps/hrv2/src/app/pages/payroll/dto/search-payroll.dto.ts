import {BasePayrollEntity} from "../bases";
import {FilterTypeEnum, SearchTypeEnum, EmployeeStatusEnum} from "@minhdu-fontend/enums";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchPayrollDto extends BasePayrollEntity {
  readonly createdAt: Date,
  readonly name: string,
  readonly code: string,
  readonly unit: string,
  readonly branch: string,
  readonly filterType: FilterTypeEnum,
  readonly titles: string[]
  readonly searchType: SearchTypeEnum,
  readonly employeeId: number,
  readonly startedAt: Date,
  readonly endedAt: Date,
  readonly employeeType: string
  readonly empStatus: EmployeeStatusEnum
}

export type SearchPayrollDto = BaseSearchDto<BaseSearchPayrollDto>
