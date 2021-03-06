import { GenderTypeEnum } from '../enums';
import { totalSalary } from './hr/salary/salary';

export interface ResponsePaginate<T> {
  total: number;
  data: T[];
}

export interface ResponsePaginatePayroll<T> extends ResponsePaginate<T> {
  isTimeSheet: boolean;
}

export interface ResponsePaginateOvertimePayrollV1<T>
  extends ResponsePaginate<T> {
  totalSalary: totalSalary;
}

export interface ResponsePaginateOvertimePayroll<T>
  extends ResponsePaginate<T> {
  total2?: number;
}

export interface RequestPaginate {
  take?: number;
  skip?: number;
  name?: string;
  workedAt?: Date;
  code?: string;
  position?: string;
  department?: string;
  branch?: string;
  gender?: GenderTypeEnum;
}
