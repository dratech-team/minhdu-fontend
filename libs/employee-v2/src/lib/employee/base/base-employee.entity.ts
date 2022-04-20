import {BaseEntity} from "@minhdu-fontend/base-entity";
import {EmployeeType, Gender, RecipeType} from "@minhdu-fontend/enums";
import {
  Branch,
  Category,
  Degree,
  Position,
  Relative, Salary,
  SalaryHistory,
  Ward,
  WorkHistory
} from "@minhdu-fontend/data-models";
import {Payroll} from "../../../../../../apps/hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {Contracts} from "../../../../../data-models/hr/employee/contracts";

export interface BaseEmployeeEntity extends BaseEntity{
  code: string,
  lastName: string,
  avt?: string,
  gender: Gender,
  phone?: string,
  workPhone?: string,
  birthday: Date,
  birthplace: string,
  identify: string,
  idCardAt: Date,
  issuedBy: string,
  ward: Ward,
  address: string,
  email?: string,
  religion: string,
  ethnicity: string,
  mst?: string,
  createdAt: Date,
  workedAt: Date;
  workday: number,
  contractAt: string,
  leftAt: Date,
  isFlatSalary: boolean,
  position: Position,
  branch: Branch,
  note?: string;
  facebook: string,
  zalo: string,
  degrees?: Degree[],
  bhyt?: string,
  payrolls: Payroll[],
  contracts: Contracts[];
  relatives: Relative[],
  workHistories?: WorkHistory[];
  historySalaries: SalaryHistory[];
  contractType?: string,
  recipeType: RecipeType,
  salaryHistories: Salary[],
  type: EmployeeType,
  isSelect?: boolean,
  category?: Category
}
