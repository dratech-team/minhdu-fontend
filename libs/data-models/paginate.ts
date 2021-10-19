import { Gender } from '../enums';

export interface ResponsePaginate<T> {
  total: number,
  data: T[],
}

export interface ResponsePaginatePayroll<T> extends ResponsePaginate<T> {
  isTimeSheet: boolean
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
