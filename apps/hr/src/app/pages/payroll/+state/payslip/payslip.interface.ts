

export interface Payslip {
  //CT2
  basic?: number,
  stay?:number,
  allowance?: number,
  overtime?: number,
  deduction?:number,
  actualDay?: number,
  salaryActual?: number,

  //CT1
  basicSalary?: number,
  totalStandard?: number,
  workdayNotInHoliday?: number,
  worksInHoliday?:workHoliday[],
  worksNotInHoliday:workHoliday[],
  totalWorkday?:number
  payslipNormalDay?:number,
  payslipInHoliday?:number,
  payslipNotInHoliday?:number,
  staySalary?:number,
  payslipOutOfWorkday?:number,

  //chung
  workday: number,
  tax: number,
  total: number,
}
interface workHoliday {
  day: number,
  datetime: Date,
  rate: number
}
