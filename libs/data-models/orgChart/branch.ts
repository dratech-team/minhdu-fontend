import { BaseOrgChart } from './base-org-chart';
import { Department } from './department';

export interface Branch extends BaseOrgChart{
  code?:string,
  departments?: Department[],
}
