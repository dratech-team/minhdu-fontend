import {BaseEmployeeEntity} from "../../base";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {EmployeeStatusEnum, EmployeeType} from "@minhdu-fontend/enums";
import {FlatSalaryTypeEnum} from "../../../../../../../apps/hrv2/src/app/pages/employee/enums/flat-salary-type.enum";
import {NzTableSortOrder} from "ng-zorro-antd/table";

export interface BaseSearchEmployeeDto extends BaseEmployeeEntity {
  readonly name: string
  readonly province: string,
  readonly district: string,
  readonly ward: string,
  readonly position: string,
  readonly branch: string,
  readonly status: EmployeeStatusEnum,
  readonly employeeType: EmployeeType,
  readonly isFlatSalary: FlatSalaryTypeEnum,
  readonly categoryId: number,
  readonly orderBy?: string;
  readonly orderType?: NzTableSortOrder;

}

export type SearchEmployeeDto = BaseSearchDto<BaseSearchEmployeeDto>
