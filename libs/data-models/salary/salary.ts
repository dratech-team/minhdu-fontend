import { Payroll } from '../../../apps/hr/src/app/pages/payroll/+state/payroll/payroll.interface';
import { DatetimeUnitEnum, SalaryTypeEnum } from '../../enums';
import { SalaryHistory } from './salary-history';
import { payslip } from './payslip';


export interface Salary {
  id: number,
  title: string,
  type: SalaryTypeEnum,
  times: number,
  price: number,
  unit: DatetimeUnitEnum,
  rate: number,
  datetime: Date,
  forgot: boolean,
  note: string,
  employeeId: number,
  Payroll: Payroll,
  PayrollId: number,
  salaryHistory: SalaryHistory,
  salaryHistoryId: number,
  payslip: payslip,
}
