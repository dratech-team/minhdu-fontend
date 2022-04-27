import { PayrollEntity } from '../../payroll/entities';
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {RequireOnlyOne} from "../../../../shared/types";

export interface ModalRemoteSalaryData {
  add?: {
    payroll: PayrollEntity,
    multiple?: boolean

  },
  update?: {
    salary: any,
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}
export type ModalAddOrUpdateRemote = RequireOnlyOne<ModalRemoteSalaryData, 'add' | 'update'>
