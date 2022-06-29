import { Payroll } from '../../../../apps/hr/src/app/pages/payroll/+state/payroll/payroll.interface';
import { DatetimeUnitEnum, SalaryTypeEnum } from '../../../enums';
import { SalaryHistory } from './salary-history';
import { Employee } from '../employee/employee';
import { SalarySetting } from '../../../../apps/hr/src/app/pages/template/+state/teamlate-salary/salary-setting';
import { PartialDayEnum } from '../../partial-day.enum';

export interface Salary {
  partial?: PartialDayEnum;
  id: number;
  title: string;
  type: SalaryTypeEnum;
  times: number;
  price: number;
  unit: DatetimeUnitEnum;
  rate: number;
  datetime: Date;
  startedAt: Date;
  endedAt: Date;
  startedTime: Date;
  endedTime: Date;
  forgot: boolean;
  note: string;
  employeeId: number;
  payroll: Payroll;
  payrollId: number;
  salaryHistory: SalaryHistory;
  salaryHistoryId: number;
  allowance?: any;
  DAY?: PartialDayEnum;
  employee?: Employee;
  settingId?: number;
  setting?: SalarySetting;
}

export interface SalaryPayroll {
  salary: Salary;
  payroll: Payroll;
}

export interface totalSalary {
  total: number;
  unit: {
    days: number;
    hours: number;
  };
}
