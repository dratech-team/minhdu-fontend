import {CategoryEntity} from "@minhdu-fontend/employee-v2";
import {RequireOnlyOne} from "../../../../../shared/types";
import {DepartmentEntity} from "@minhdu-fontend/orgchart-v2";

export interface ModalDepartmentData {
  add?: {
    department?: DepartmentEntity
  }
  update?: {
    department: DepartmentEntity
  }
}

export type DataAddOrUpdateCategory = RequireOnlyOne<ModalDepartmentData, 'add' | 'update'>
