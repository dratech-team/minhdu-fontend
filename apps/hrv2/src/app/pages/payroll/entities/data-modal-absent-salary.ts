import {PayrollEntity} from "./payroll.entity";
import {AbsentSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";

export interface DataModalAbsentSalary {
  add?: {
    payroll: PayrollEntity
  }
  update?: {
    salary: AbsentSalaryEntity
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}
