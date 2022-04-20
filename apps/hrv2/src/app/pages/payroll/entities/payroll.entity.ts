import {BasePayrollEntity} from "../bases";
import {Employee, Salary} from "@minhdu-fontend/data-models";
import {PayslipEntity} from "./payslip.entity";
import {RecipeType} from "@minhdu-fontend/enums";

interface Salary {
  total: number,
  unit: {
    days: number,
    hours: number
  }
}

interface Timesheet {
  datetime: any[];
  total: number
}

export interface PayrollEntity extends BasePayrollEntity{
  employee: Employee;
  salaries: Salary[];
  payslip: PayslipEntity;
  timesheet: Timesheet;
  salary?: Salary
  manConfirmedAt: Date;
  paidAt: Date;
  accConfirmedAt: Date;
  workday?: number;
  isFlatSalary: boolean,
  totalWorkday: number;
  actualday?: number;
  taxed: boolean;
  tax: number
  recipeType: RecipeType;
  note?: string
  branch?: string,
  position?: string
}
