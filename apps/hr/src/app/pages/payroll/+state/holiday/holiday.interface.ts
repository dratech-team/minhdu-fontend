import { Department } from '@minhdu-fontend/data-models';

export interface Holiday {
  id: number,
  name: string,
  datetime: Date,
  rate: number,
  department?: Department;
  note?: string
}
