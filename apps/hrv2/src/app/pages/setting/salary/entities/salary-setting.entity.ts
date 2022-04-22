import {Branch} from "@minhdu-fontend/data-models";
import {salaryReference, SalaryTypeEnum} from "../enums";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";
import {BaseSalarySettingEntity} from "../bases";
import {SalaryConstraintEntity} from "./salary-constraint.entity";

export interface SalarySettingEntity extends BaseSalarySettingEntity {
  type: SalaryTypeEnum,
  title: string,
  price?: number,
  prices?: number[],
  reference?: salaryReference,
  constraints?: SalaryConstraintEntity[]
  branches?: Branch[]
  unit?: DatetimeUnitEnum
  totalOf: SalaryTypeEnum [],
  workday?: number,
}
