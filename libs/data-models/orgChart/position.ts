import { BaseOrgChart } from './base-org-chart';
import { Department } from './department';

export interface Position extends BaseOrgChart{
  workday: number,
  department: Department,
  departmentId: number,
}
