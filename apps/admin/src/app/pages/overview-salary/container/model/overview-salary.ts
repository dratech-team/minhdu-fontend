import { Branch } from '@minhdu-fontend/data-models';

export interface OverviewSalary {
  id: number;
  name: string;
  branch: Branch;
  type: string;
  datetime: Date;
  total: number;
}
