import { Branch } from './branch.interface';
import { BaseOrgChart } from './base-org-chart.interface';
import { Position } from './position.interface';

export interface Department extends BaseOrgChart{
  branch: Branch,
  branchId: number,
  positions: Position[]
}
