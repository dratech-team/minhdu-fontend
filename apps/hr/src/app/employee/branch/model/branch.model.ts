import { FullDepartment } from '../../department/model/department.model';

export interface Branch {
  id?: string;
  code?:string,
  name?: string;
}

export interface FullBranch {
  id?: string;
  name?: string;
  departments?: FullDepartment[];
}
