

interface Payslip {
  workday: number,
  tax: number,
  total: number,
  actualDay: number,
}
export interface PayslipCT1 extends Payslip{
  basicSalary: number,
  totalStandard: number,
  workdayNotInHoliday: number,
  worksInHoliday:workHoliday[],
  worksNotInHoliday:workHoliday[],
  totalWorkday:number
  payslipNormalDay:number,
  payslipInHoliday:number,
  payslipNotInHoliday:number,
  staySalary:number,
  deduction:number,
  payslipOutOfWorkday:number,
}
export interface PayslipCT2 extends Payslip{
  basic: number,
  stay:number,
  allowance: number,
  overtime: number,
  deduction:number,
  salaryActual: number,
}

interface workHoliday {
  day: number,
  datetime: Date,
  rate: number
}
