import {PayrollEntity} from "./payroll.entity";
import {AllowanceSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {RequireOnlyOne} from "../../../../shared/types";

export interface DataModalAllowanceSalary {
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
export type DataAddOrUpdateAllowance = RequireOnlyOne<DataModalAllowanceSalary, 'add'|'update'>
