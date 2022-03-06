import {App} from "../../../enums";

export interface Category {
  id: number,
  name: string,
  app?: App,
  BranchId?: number,
  EmployeeIds?: number []
}
