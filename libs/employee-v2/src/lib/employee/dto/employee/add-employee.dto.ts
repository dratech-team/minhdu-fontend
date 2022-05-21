import {BaseAddDto} from '@minhdu-fontend/base-dto';
import {BaseEmployeeEntity} from "../../base";
import {FlatSalaryTypeEnum} from "../../../../../../../apps/hrv2/src/app/pages/employee/enums/flat-salary-type.enum";

export interface BaseAddEmployeeDto extends BaseEmployeeEntity {
  isFlatSalary: FlatSalaryTypeEnum,
  positionId: number,
  branchId: number,
  wardId: number
  categoryId?: number,
  contract?: {
    createdAt?: Date,
    expiredAt?: Date
  }
}

export type AddEmployeeDto = BaseAddDto<BaseAddEmployeeDto>
