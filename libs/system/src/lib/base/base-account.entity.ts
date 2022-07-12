import { BaseEntity } from '@minhdu-fontend/base-entity';

export interface BaseAccountEntity extends BaseEntity {
  username: string;
  loggedAt: Date;
  ip: string;
  timestamp: Date;
  createdAt: Date;
}
