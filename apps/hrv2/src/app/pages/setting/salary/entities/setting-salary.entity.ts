import {Branch} from "@minhdu-fontend/data-models";
import {salaryReference, SalaryTypeEnum} from "../enums";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";
import {BaseSettingSalaryEntity} from "../bases";
import {SalaryConstraintEntity} from "./salary-constraint.entity";

export interface SettingSalaryEntity extends BaseSettingSalaryEntity {
  type: SalaryTypeEnum,
  price?: number,
  reference?: salaryReference,
  constraints?: SalaryConstraintEntity[]
  branches?: Branch[]
  unit?: DatetimeUnitEnum
  types: SalaryTypeEnum [],
  workday?: number
}
