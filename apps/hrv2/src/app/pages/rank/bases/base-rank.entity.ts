import { BaseEntity } from '@minhdu-fontend/base-entity';
import { Employee } from '@minhdu-fontend/data-models';

export interface BaseRankEntity extends BaseEntity {
  employee: Employee;
  dayOff: number;
  salary: number;
}
