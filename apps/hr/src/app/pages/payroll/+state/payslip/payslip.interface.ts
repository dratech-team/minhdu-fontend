export interface Payslip {
  workday: number,
  tax: number,
  total: number,
  actualDay: number,
  basic: number,
  totalStandard: number;
  overtime: number;
  deduction: number;
  daySalary: number;
  workdayNotInHoliday: number;
  worksInHoliday: workHoliday[];
  worksNotInHoliday: workHoliday[];
  totalWorkday: number;
  payslipNormalDay: number;
  payslipInHoliday: number;
  payslipNotInHoliday: number;
  stay: number;
  payslipOutOfWorkday: number;
  allowance: number;
}

interface workHoliday {
  day: number,
  datetime: Date,
  rate: number
}
