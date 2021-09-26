

export interface Payslip {
  basic: number,
  stay: number,
  overtime: number,
  allowance?: number,
  deduction?: number,
  daySalary: number,
  actualDay: number,
  workday: number,
  salaryActual: number,
  tax?: number,
  total?: number
}
