import {BaseEntity} from '@minhdu-fontend/base-entity';

export interface BaseConsignmentEntity extends BaseEntity {
  readonly code: string;
  readonly mfg: Date;
  readonly exp: Date
  readonly createdAt: Date,
  readonly amount?: number
}
