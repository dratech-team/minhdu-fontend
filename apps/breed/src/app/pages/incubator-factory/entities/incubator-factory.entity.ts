import { EggEnum } from './egg.enum';
import { Branch } from '@minhdu-fontend/data-models';
import { EggTypeEntity } from '../../egg-type/entities/egg-type.entity';

export interface IncubatorFactoryEntity {
  readonly id: number;
  readonly type: EggEnum;
  readonly amount: number;
  readonly branch: Branch;
  readonly createdAt: Date;
  readonly endedAt: Date;
  readonly totalEgg: number;
  readonly eggs: Egg[];
}

export interface Egg {
  readonly type: EggTypeEntity
  readonly amount: number
  readonly rate: number;
}


