import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { PartialDayEnum } from '@minhdu-fontend/data-models';

export interface TemplateSalary {
  id: number,
  title: string,
  price: number,
  type: SalaryTypeEnum,
  positionId: any,
  partialDay: PartialDayEnum,
  unit: DatetimeUnitEnum
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
