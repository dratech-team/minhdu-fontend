import { BaseOrgChart } from './base-org-chart.interface';
import { Employee } from '../../../apps/hr/src/app/pages/employee/+state/employee/employee.interface';
import { Department } from './department.interface';

export interface Position extends BaseOrgChart{
  workday: number,
  department: Department,
  departmentId: number,

}
