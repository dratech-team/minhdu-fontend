import { BaseEntity } from '@minhdu-fontend/base-entity';

export interface BaseDepartmentEntity extends BaseEntity {
  code?: string;
  branchId: number;
  name: string;
  note?: string;
  employeeIds: number[];
}
