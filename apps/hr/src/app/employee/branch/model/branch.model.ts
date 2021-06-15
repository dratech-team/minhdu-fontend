import { FullDepartment } from '../../department/model/department.model';

export interface Branch {
  id?: string;
  code?:string,
  name?: string;
  departmentIds?: number[];
}

export interface FullBranch {
  id?: string;
  name?: string;
  departments?: FullDepartment[];
}
