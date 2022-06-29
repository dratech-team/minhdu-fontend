import { BaseEntity } from '@minhdu-fontend/base-entity';

interface WorkHoliday {
  day: number;
  datetime: Date;
  rate: number;
}

export interface PayslipEntity extends BaseEntity {
  workday: number;
  tax: number;
  total: number;
  actualDay: number;
  basic: number;
  totalStandard: number;
  overtime: number;
  deduction: number;
  daySalary: number;
  workdayNotInHoliday: number;
  worksInHoliday: WorkHoliday[];
  worksNotInHoliday: WorkHoliday[];
  totalWorkday: number;
  payslipNormalDay: number;
  payslipInHoliday: number;
  payslipNotInHoliday: number;
  stay: number;
  payslipOutOfWorkday: number;
  allowance: number;
  bsc: number;
  bscSalary: number;
  workdays: number;
  totalSalaryWorkday: number;
  times: number;
  totalSalaryTimes: number;
}
