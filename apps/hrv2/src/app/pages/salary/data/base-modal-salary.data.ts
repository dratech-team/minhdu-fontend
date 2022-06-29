import { PayrollEntity } from '../../payroll/entities';
import { SalaryEntity } from '../entities';

export interface ModalAddSalary {
  payroll: PayrollEntity;
  salary?: SalaryEntity;
  multiple?: boolean;
}

export interface ModalUpdateSalary {
  salary: SalaryEntity;
  multiple?: {
    salaries: SalaryEntity[];
  };
}

export interface BaseModalSalaryData {
  add?: ModalAddSalary;
  update?: ModalUpdateSalary;
}
