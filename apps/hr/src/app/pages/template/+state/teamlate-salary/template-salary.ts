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
