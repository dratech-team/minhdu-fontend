import { PayrollEntity } from '../../payroll/entities';

export interface ModalOnsiteSalaryData {
  add: {
    payroll: PayrollEntity
  },
  update: {
    salary: any
  }
}
