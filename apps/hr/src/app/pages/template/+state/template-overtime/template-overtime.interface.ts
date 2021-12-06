import { DatetimeUnitEnum, EmployeeType, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Branch, Position } from '@minhdu-fontend/data-models';

export interface TemplateOvertime {
  id: number,
  title: string;
  type: SalaryTypeEnum;
  price: number;
  unit: DatetimeUnitEnum;
  note?: string;
  positions?: Position [];
  branch: Branch;
  rate: number;
  employeeType: EmployeeType,
}
export interface ReqOvertime extends Omit<TemplateOvertime, "position" | "branch"> {
  positionIds: number[];
  branchId: number;

}

export interface TemplateOvertimeDTO {
  take?: number,
  skip?: number,
  title?: string,
  price?: number,
  unit?: DatetimeUnitEnum,
  note?: string,
  positions?: string[],
  department?: string,
  branch?: string
}
