import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Branch, PartialDayEnum} from '@minhdu-fontend/data-models';
import {salaryReference} from "../../enums";

export interface SalarySetting {
  id: number,
  title: string,
  price?: number,
  type: SalaryTypeEnum,
  rate: number,
  reference?: salaryReference,
  constraints?: SalaryTypeEnum[]
  positionId?: any,
  branches?: Branch[]
  unit?: DatetimeUnitEnum
  types: SalaryTypeEnum [],
  workday?: number
}

export interface SalaryConstraint {
  id: number,
  type: SalaryTypeEnum
}

export interface TemplateSalaryDTO {
  take?: number,
  skip?: number,
  title?: string,
  price?: number,
  unit?: DatetimeUnitEnum,
  note?: string,
  position?: string,
  department?: string,
  branch?: string,
  salaryType?: SalaryTypeEnum,
}
