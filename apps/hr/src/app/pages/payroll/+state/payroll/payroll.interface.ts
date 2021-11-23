import { Employee, Salary } from '@minhdu-fontend/data-models';
import { EmployeeType, FilterTypeEnum, SalaryTypeEnum, SearchTypeEnum } from '@minhdu-fontend/enums';
import { Payslip } from '../payslip/payslip.interface';

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
  totalWorkday: number;
  payrollIds: number[];
  payslip: Payslip;
  taxed: boolean;
  timesheet: { datetime: any[]; total: number };
}

export interface PayrollDTO{
  take?: number,
  skip?: number,
  createdAt?: Date,
  name?: string,
  code?: string,
  position?: string,
  department?: string,
  branch?: string,
  paidAt?: boolean,
  accConfirmedAt?: boolean,
  filterType?: FilterTypeEnum,
  salaryType?: SalaryTypeEnum,
  salaryTitle?: string,
  searchType?: SearchTypeEnum,
  employeeId?: number,
  startedAt?: Date,
  endedAt?: Date
}
