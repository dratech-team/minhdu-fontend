import { Employee, Salary } from '@minhdu-fontend/data-models';
import { EmployeeType } from '@minhdu-fontend/enums';
import { Payslip } from '../payslip/payslip.interface';

export type AddPayroll = Pick<Payroll, 'createdAt'> & {
  employeeId: number;
  employeeType: EmployeeType;
};

export interface Payroll {
  id: number;
  employee: Employee;
  createdAt: Date;
  salaries: Salary[];
  manConfirmedAt: Date;
  paidAt: Date;
  accConfirmedAt: Date;
  totalWorkday: number;
  payrollIds: number[];
  payslip: Payslip;
  contracted: boolean;
  timesheet: { datetime: any[]; total: number };
}
