import { EggEnum } from './egg.enum';
import { Branch } from '@minhdu-fontend/data-models';

export interface IncubatorFactoryEntity {
  readonly id: number;
  readonly type: EggEnum;
  readonly amount: number;
  readonly branch: Branch;
  readonly createdAt?: Date;
}
