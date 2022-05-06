import {BaseEmployeeEntity} from "../../base";
import {BaseAddDto, BaseSearchDto} from "@minhdu-fontend/base-dto";
import {PaginationDto} from "@minhdu-fontend/constants";
import {EmployeeType, Gender} from "@minhdu-fontend/enums";
import {FlatSalaryTypeEnum} from "../../../../../../../apps/hrv2/src/app/pages/employee/enums/flat-salary-type.enum";
import {StatusEnum} from "../../../../../../../apps/sell/src/app/shared/enums/status.enum";

export interface BaseSearchEmployeeDto extends BaseEmployeeEntity {
  readonly name: string
  readonly province: string,
  readonly district: string,
  readonly ward: string,
  readonly position: string,
  readonly branch: string,
  readonly status: StatusEnum,
  readonly employeeType: EmployeeType,
  readonly  isFlatSalary: FlatSalaryTypeEnum,
  readonly  categoryId: number
}

export type SearchEmployeeDto = BaseSearchDto<BaseSearchEmployeeDto>
