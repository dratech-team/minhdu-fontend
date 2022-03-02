import { Gender } from '../enums';
import { totalSalary } from './hr/salary/salary';

export interface ResponsePaginate<T> {
  total: number,
  data: T[],
}

export interface ResponsePaginatePayroll<T> extends ResponsePaginate<T> {
  isTimeSheet: boolean
}

export interface ResponsePaginateOvertimePayroll<T> extends ResponsePaginate<T> {
  totalSalary?: totalSalary
}

export interface RequestPaginate {
  take?: number,
  skip?: number,
  name?: string,
  workedAt?: Date,
  code?: string,
  position?: string,
  department?: string,
  branch?: string,
  gender?: Gender;
}
