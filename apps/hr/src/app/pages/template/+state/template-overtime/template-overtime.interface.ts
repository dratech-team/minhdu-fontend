import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Branch, Position } from '@minhdu-fontend/data-models';

export interface TemplateOvertime {
  title: string;
  type: SalaryTypeEnum;
  price: number;
  unit: DatetimeUnitEnum;
  note?: string;
  positions?: Position [];
  branch: Branch;
  rate: number;
}
export interface ReqOvertime extends Omit<TemplateOvertime, "position" | "branch"> {
  positionIds: number[];
  branchId: number;
}
