import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';

export interface TemplateOvertime{
  title: string,
  price: number,
  unit:DatetimeUnitEnum,
  note?: string,
  positionId: number,
  type?: SalaryTypeEnum,
}
