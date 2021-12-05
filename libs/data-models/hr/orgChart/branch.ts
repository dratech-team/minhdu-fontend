import { BaseOrgChart } from './base-org-chart';
import { Department } from './department';
import { Salary } from '../salary/salary';
import { Position } from './position';

export interface Branch extends BaseOrgChart{
  code?:string,
  _count?:any,
  allowances?: Salary [],
  positions?: Position[]
}
