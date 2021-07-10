import { Gender } from '../enums';

export interface ResponsePaginate<T> {
  total: number,
  data: T[],
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
