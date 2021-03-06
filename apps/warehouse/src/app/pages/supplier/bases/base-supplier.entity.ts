import { BaseEntity } from '@minhdu-fontend/base-entity';

export interface BaseSupplierEntity extends BaseEntity {
  readonly name: string;
  readonly code?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly debt?: number;
  readonly total?: number;
}
