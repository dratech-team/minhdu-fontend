import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Position } from '@minhdu-fontend/data-models';

export interface TemplateOvertime {
  title: string,
  price: number,
  unit: DatetimeUnitEnum,
  note?: string,
  positionId: number,
  type?: SalaryTypeEnum,
  position: Position,
}
