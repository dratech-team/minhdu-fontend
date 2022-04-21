import {BasePayrollEntity} from "../bases";
import {FilterTypeEnum, SearchTypeEnum, EmployeeStatusEnum, EmployeeType} from "@minhdu-fontend/enums";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {RangeDay} from "@minhdu-fontend/data-models";

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
  readonly empStatus: EmployeeStatusEnum
  readonly employeeType: EmployeeType
}

export type SearchPayrollDto = BaseSearchDto<BaseSearchPayrollDto>
