import {PayrollEntity} from "./payroll.entity";
import {PermanentSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";

export interface dataModalPermanentSalary {
  add?: {
    payroll: PayrollEntity,
  }
  update?: {
    salary: PermanentSalaryEntity
    multiple: {
      salariesSelected: SalaryPayroll[]
    }
  }
  updateHistory?: {
    salary: PermanentSalaryEntity
  }
}
