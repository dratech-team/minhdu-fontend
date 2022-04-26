import {PayrollEntity} from "../entities/payroll.entity";
import {AllowanceSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {RequireOnlyOne} from "../../../../shared/types";

export interface ModalAllowanceSalaryData {
  add?: {
    payroll: PayrollEntity,
    multiple?: boolean
  }
  update?: {
    salary: AllowanceSalaryEntity & { workedAt: Date }
    multiple?: {
      salariesSelected: SalaryPayroll[]
    },
  }
}
export type ModalAddOrUpdateAllowance = RequireOnlyOne<ModalAllowanceSalaryData, 'add'|'update'>
