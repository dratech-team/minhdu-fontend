import {PayrollEntity} from "./payroll.entity";
import {PermanentSalaryEntity, RemoteSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface DataModalRemoteSalary {
  add?: {
    payroll: PayrollEntity,
    multiple: boolean
  }
  update?: {
    salary: RemoteSalaryEntity
    multiple: {
      salariesSelected: SalaryPayroll[]
    }
  }
}
