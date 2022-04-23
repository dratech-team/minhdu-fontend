import {PayrollEntity} from "./payroll.entity";
import {DeductionSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";

export interface DataModalAbsentSalary {
  add?: {
    payroll: PayrollEntity
  }
  update?: {
    salary: DeductionSalaryEntity
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}
