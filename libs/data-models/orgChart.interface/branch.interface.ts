import { BaseOrgChart } from './base-org-chart.interface';
import { Department } from './department.interface';

export interface Branch extends BaseOrgChart{
  code:string,
  departments: Department[],
}
