import { Employee, Salary,  } from '@minhdu-fontend/data-models';
import { payslip } from 'libs/data-models/hr/salary/payslip';

export interface Payroll {
  id:number
  employee: Employee,
  createdAt: Date,
  payslip: payslip,
  salaries: Salary[],
  manConfirmedAt: Date,
  paidAt: Date,
  accConfirmedAt: Date,
}

