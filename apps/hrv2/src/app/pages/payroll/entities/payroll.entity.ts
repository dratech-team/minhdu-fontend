import {BasePayrollEntity} from '../bases';
import {Employee} from '@minhdu-fontend/data-models';
import {PayslipEntity} from './payslip.entity';
import {RecipeType} from '@minhdu-fontend/enums';
import {DeductionSalaryEntity, SalaryEntity} from "../../salary/entities";
import {HolidaySalaryEntity} from "../../salary/entities/holiday-salary.entity";
import {FilterSalaryEnum} from "../enums/filter-salary.enum";
import {NzTableSortOrder} from "ng-zorro-antd/table";


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
    hour: number,
    minute?: number
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
  workday: number;
  isFlatSalary: boolean,
  totalWorkday: number;
  actualday: number;
  taxed: boolean;
  tax: number
  recipeType: RecipeType;
  note: string
  branch: string,
  position: string
  salariesv2: SalaryEntity[],
  basics: SalaryEntity[],
  stays: SalaryEntity[],
  salaries: SalaryEntity[],
  absents: SalaryEntity [],
  deductions: DeductionSalaryEntity [],
  overtimes: SalaryEntity [],
  allowances: SalaryEntity[],
  remotes: SalaryEntity[],
  holidays: HolidaySalaryEntity[]
  dayoffs: SalaryEntity[],
  payrollIds: number[];
  total: {
    payroll: number;
    basic: number;
    stay: number;
    allowance: TotalSalary;
    absent: TotalSalary;
    deduction: number;
    overtime: TotalSalary;
    remote: { duration: number };
    holiday: { duration: number, total: number }
    dayOff: { duration: number }
  }
  searchOvertime?: {
    column: FilterSalaryEnum;
    type: NzTableSortOrder
  }
  expand: boolean
}
