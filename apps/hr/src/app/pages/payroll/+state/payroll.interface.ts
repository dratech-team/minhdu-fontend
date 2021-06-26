import { Employee } from '../../employee/+state/employee.interface';
import { Position, Salary } from '@minhdu-fontend/data-models';
import { payslip } from '../../../../../../../libs/data-models/salary/payslip';

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

