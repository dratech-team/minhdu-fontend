import { Branch } from './branch';
import { BaseOrgChart } from './base-org-chart';

export interface Position extends BaseOrgChart {
  code: string;
  workday?: number;
  branches?: Branch[];
  _count?: any;
}
