import { Employee, Salary,  } from '@minhdu-fontend/data-models';
import { Payslip } from '../payslip/payslip.interface';


export interface Payroll {
  id: number
  employee: Employee,
  createdAt: Date,
  salaries: Salary[],
  manConfirmedAt: Date,
  paidAt: Date,
  accConfirmedAt: Date,
  actualDay: number,
  payrollIds: number[]
  payslip:  Payslip
}
