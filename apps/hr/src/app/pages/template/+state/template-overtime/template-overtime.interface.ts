import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Branch, Position } from '@minhdu-fontend/data-models';

export interface TemplateOvertime {
  title: string;
  type?: SalaryTypeEnum;
  price: number;
  unit: DatetimeUnitEnum;
  note?: string;
  position: Position;
  branch: Branch;
  rate: number;
}
