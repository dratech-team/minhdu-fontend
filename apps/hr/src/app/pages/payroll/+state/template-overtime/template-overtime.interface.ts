import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Position } from '@minhdu-fontend/data-models';

export interface TemplateOvertime {
  title: string,
  type?: SalaryTypeEnum,
  price: number,
  unit: DatetimeUnitEnum,
  note?: string,
  positionId: number,
  position: Position,
  rate: number
}
