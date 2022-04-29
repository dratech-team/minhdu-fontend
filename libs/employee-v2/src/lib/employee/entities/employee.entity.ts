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
  SalaryHistory, Ward,
  WorkHistory
} from "@minhdu-fontend/data-models";
import {EmployeeType, RecipeType} from "@minhdu-fontend/enums";



export interface EmployeeEntity extends BaseEmployeeEntity{
  stt?: number,
  avt?: string,
  lastName: string,
  workPhone?: string,
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
  religion: string,
  ethnicity: string,
  mst?: string,
  zalo: string,
  bhyt?: string,
  facebook: string,
  isSelect?: boolean,
  birthplace: string,
  contractType?: string,
  recipeType: RecipeType,
  type: EmployeeType,
  ward: Ward,
  createdAt: Date,
  workedAt: Date;
  workday: number,
  idCardAt: Date,
  issuedBy: string,
  birthday: Date,
  email?: string,
  contractAt: string,
  leftAt?: Date,
  isFlatSalary: boolean,
}

