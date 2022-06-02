import {PayrollEntity} from "../entities";
import {SalaryEntity} from "../../salary/entities";
import {RequireOnlyOne} from "../../../../shared/types";

export interface ModalAllowanceSalaryData {
  add?: {
    payroll?: PayrollEntity,
    salary?: SalaryEntity
    multiple?: boolean
  }
  update?: {
    salary: SalaryEntity & { workedAt: Date }
    multiple?: {
      salaries: SalaryEntity[]
    },
  }
}
export type ModalAddOrUpdateAllowance = RequireOnlyOne<ModalAllowanceSalaryData, 'add'|'update'>
