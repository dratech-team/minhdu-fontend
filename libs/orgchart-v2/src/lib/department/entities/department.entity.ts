import {BaseDepartmentEntity} from "../bases";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";
import {App} from "@minhdu-fontend/enums";

export interface DepartmentEntity extends BaseDepartmentEntity{
  branch: BranchEntity
  app: App
  _count:{
    employees: number
  }
}
