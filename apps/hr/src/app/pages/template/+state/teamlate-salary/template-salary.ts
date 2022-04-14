import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import {Branch, PartialDayEnum} from '@minhdu-fontend/data-models';

export interface TemplateSalary {
  id: number,
  title: string,
  price?: number,
  type: SalaryTypeEnum,
  positionId?: any,
  branches?: Branch[]
  partialDay?: PartialDayEnum,
  unit?: DatetimeUnitEnum
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
