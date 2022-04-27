import { PayrollEntity } from '../../payroll/entities';

export interface ModalRemoteSalaryData {
  add: {
    payroll: PayrollEntity
  },
  update: {
    salary: any
  }
}
