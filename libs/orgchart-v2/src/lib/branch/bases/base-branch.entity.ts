import { BaseEntity } from '@minhdu-fontend/base-entity';
import { BranchStatusEnum } from '../enums/branch-status.enum';

export interface BaseBranchEntity extends BaseEntity {
  code?: string;
  name: string;
  phone?: string;
  address?: string;
  status?: BranchStatusEnum;
}
