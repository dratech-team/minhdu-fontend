import {BasePayrollEntity} from "../bases";
import {Employee} from "@minhdu-fontend/data-models";
import {PayslipEntity} from "./payslip.entity";
import {RecipeType} from "@minhdu-fontend/enums";
import {
  AbsentSalaryEntity,
  AllowanceSalaryEntity,
  OvertimeSalaryEntity,
  PermanentSalaryEntity, SalaryEntity, RemoteSalaryEntity
} from "../../salary/entities";
import {DeductionSalaryEntity} from "../../salary/entities/deduction-salary.entity";

interface Salary {
  total: number,
  unit: {
    days: number,
    hours: number
  }
}

export interface TotalSalary {
  duration: {
    day: number,
    hour?: number
  }
  total: number,
  price: number
}

interface Timesheet {
  datetime: any[];
  total: number
}

export interface PayrollEntity extends BasePayrollEntity {
  employee: Employee;
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
  salariesv2: PermanentSalaryEntity[],
  basics: PermanentSalaryEntity[],
  stays: PermanentSalaryEntity[],
  salaries: SalaryEntity[],
  absents: AbsentSalaryEntity [],
  deductions: DeductionSalaryEntity [],
  overtimes: OvertimeSalaryEntity [],
  allowances: AllowanceSalaryEntity[],
  remotes: RemoteSalaryEntity[],
  payrollIds?: number[]
  totalAllowance?: TotalSalary
  totalOvertime?: TotalSalary
  totalAbsent?: TotalSalary
  totalRemote?: {
    duration: number
  }
  totalBasic?: number
  totalStay?: number
}
