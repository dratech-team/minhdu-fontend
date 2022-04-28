import {Branch} from "@minhdu-fontend/data-models";
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from "@minhdu-fontend/enums";
import {BaseSalarySettingEntity} from "../bases";
import {SalaryConstraintEntity} from "./salary-constraint.entity";
import {PriceType} from "../enums";

export interface SalarySettingEntity extends BaseSalarySettingEntity {
  type: SalaryTypeEnum,
  title: string,
  price?: number,
  prices?: number[],
  reference?: PriceType,
  constraints?: SalaryConstraintEntity[]
  branches?: Branch[]
  unit?: DatetimeUnitEnum
  totalOf: SalaryTypeEnum [],
  workday?: number,
  employeeType?:EmployeeType
}
