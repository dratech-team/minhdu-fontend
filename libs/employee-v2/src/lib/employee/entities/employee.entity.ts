import {BaseEmployeeEntity} from "../base";
import {Payroll} from "../../../../../../apps/hr/src/app/pages/payroll/+state/payroll/payroll.interface";
import {Contracts} from "../../../../../data-models/hr/employee/contracts";
import {Category, Salary, SalaryHistory, Ward, WorkHistory} from "@minhdu-fontend/data-models";
import {RecipeType} from "@minhdu-fontend/enums";
import {BranchEntity, PositionEntity} from "@minhdu-fontend/orgchart-v2";
import {RelativeEntity} from "./relative.entity";
import {DegreeEntity} from "./degree.entity";


export interface EmployeeEntity extends BaseEmployeeEntity{
  code: string,
  stt?: number,
  avt?: string,
  payrolls: Payroll[],
  contracts: Contracts[];
  relatives: RelativeEntity[],
  workHistories?: WorkHistory[];
  historySalaries: SalaryHistory[];
  salaryHistories: Salary[],
  degrees: DegreeEntity[],
  position: PositionEntity,
  branch: BranchEntity,
  category?: Category
  isSelect?: boolean,
  contractType?: string,
  recipeType: RecipeType,
  ward: Ward,
  isFlatSalary: boolean,
  contractAt: string,
  leftAt?: Date,
}

