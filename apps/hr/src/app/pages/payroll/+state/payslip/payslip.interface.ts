interface Payslip {
  workday: number,
  tax: number,
  total: number,
  actualDay: number,
  basic: number,
  stay: number,
}

export interface PayslipCT1 extends Payslip {
  totalStandard: number,
  workdayNotInHoliday: number,
  worksInHoliday: workHoliday[],
  worksNotInHoliday: workHoliday[],
  totalWorkday: number
  payslipNormalDay: number,
  payslipInHoliday: number,
  payslipNotInHoliday: number,
  deduction: number,
  payslipOutOfWorkday: number,
}

export interface PayslipCT2 extends Payslip {
  allowance: number,
  overtime: number,
  deduction: number,
  salaryActual: number,
}

interface workHoliday {
  day: number,
  datetime: Date,
  rate: number
}
