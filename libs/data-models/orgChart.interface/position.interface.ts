import { BaseOrgChart } from './base-org-chart.interface';
import { Department } from './department.interface';

export interface Position extends BaseOrgChart{
  workday: number,
  department: Department,
  departmentId: number,

}
