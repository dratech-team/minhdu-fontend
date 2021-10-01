
export interface payslip {
  basic: number,
  stay:number,
  allowance: number,
  overtime: number,
  deduction:number,
  workday: number,
  actualDay: number,
  salaryActual: number,
  tax: number,
  total: number,
  holiday?: number,
  totalSalaryHoliday?: number
}
