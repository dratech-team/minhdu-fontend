import {BaseEmployeeEntity} from "../base";
import {Payroll} from "../../../../../../apps/hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {Contracts} from "../../../../../data-models/hr/employee/contracts";
import {
  Branch,
  Category,
  Degree,
  Position,
  Relative,
  Salary,
  SalaryHistory,
  WorkHistory
} from "@minhdu-fontend/data-models";



export interface EmployeeEntity extends BaseEmployeeEntity{
  stt?: number,
  code: string,
  payrolls: Payroll[],
  contracts: Contracts[];
  relatives: Relative[],
  workHistories?: WorkHistory[];
  historySalaries: SalaryHistory[];
  salaryHistories: Salary[],
  degrees?: Degree[],
  position: Position,
  branch: Branch,
  category?: Category
}

