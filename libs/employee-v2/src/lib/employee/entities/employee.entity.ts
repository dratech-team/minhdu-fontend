import {BaseEmployeeEntity} from "../base";



export interface EmployeeEntity extends BaseEmployeeEntity{
  stt?: number,
  code: string,
}

