import {App} from "@minhdu-fontend/enums";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";
import {EmployeeEntity} from "@minhdu-fontend/employee-v2";


export interface CategoryEntity {
  id: number,
  name: string,
  app?: App,
  branch?: BranchEntity,
  employees: EmployeeEntity[]
  note?: string
}
