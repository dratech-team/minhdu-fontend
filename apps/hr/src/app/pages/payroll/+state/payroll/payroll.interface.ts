import {Employee, Salary} from '@minhdu-fontend/data-models';
import {EmployeeType, FilterTypeEnum, RecipeType, SalaryTypeEnum, SearchTypeEnum} from '@minhdu-fontend/enums';
import {Payslip} from '../payslip/payslip.interface';

export type AddPayroll = Pick<Payroll, 'createdAt'> & {
  employeeId: number;
  employeeType: EmployeeType;
};

export interface Payroll {
  id: number;
  payrollId: number,
  employee: Employee;
  createdAt: Date;
  salaries: Salary[];
  manConfirmedAt: Date;
  paidAt: Date;
  accConfirmedAt: Date;
  workday?: number;
  totalWorkday: number;
  actualday?: number;
  payrollIds: number[];
  payslip: Payslip;
  taxed: boolean;
  tax: number
  recipeType: RecipeType;
  timesheet: { datetime: any[]; total: number };
  salary?: {
    total: number,
    unit: {
      days: number,
      hours: number
    }
  }
  note?: string
  branch?: string,
  position?: string
}

//fix me
export interface PayrollDTO {
  take?: number,
  skip?: number,
  createdAt?: Date,
  name?: string,
  code?: string,
  unit?: string,
  position?: string,
  department?: string,
  branch?: string,
  paidAt?: boolean,
  accConfirmedAt?: boolean,
  filterType?: FilterTypeEnum,
  title?: string,
  titles?: string[]
  searchType?: SearchTypeEnum,
  employeeId?: number,
  startedAt?: Date,
  endedAt?: Date,
  employeeType?: string
  isLeave?: boolean
}
