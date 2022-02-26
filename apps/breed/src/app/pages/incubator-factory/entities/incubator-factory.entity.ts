import { EggTypeEntity } from '../../egg-type/entities/egg-type.entity';
import { EggEntity } from './egg.entity';

export interface IncubatorFactoryEntity {
  readonly id: number;
  readonly type: EggTypeEntity;
  readonly amount: number;
  readonly eggs: EggEntity[];
}
