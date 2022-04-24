import {PayrollEntity} from "./payroll.entity";
import {PermanentSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface dataModalPermanentSalary {
  type:SalaryTypeEnum
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
