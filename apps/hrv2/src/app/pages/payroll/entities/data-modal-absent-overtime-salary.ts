import {PayrollEntity} from "./payroll.entity";
import {DeductionSalaryEntity, OvertimeSalaryEntity} from "../../salary/entities";
import {SalaryPayroll} from "@minhdu-fontend/data-models";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface DataModalAbsentOvertimeSalary {
  type: SalaryTypeEnum.ABSENT | SalaryTypeEnum.OVERTIME
  add?: {
    payroll: PayrollEntity,
    multiple?: boolean
  }
  update?: {
    salary: OvertimeSalaryEntity & DeductionSalaryEntity
    multiple?: {
      salaryPayrolls: SalaryPayroll[]
    },
  }
}
