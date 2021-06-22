import { Branch } from './branch';
import { BaseOrgChart } from './base-org-chart';
import { Position } from './position';

export interface Department extends BaseOrgChart{
  branch: Branch,
  branchId: number,
  positions: Position[]
}
