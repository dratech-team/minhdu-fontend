import {IncubatorFactoryEntity} from '../entities/incubator-factory.entity';

export interface CreateIncubatorFactoryDto extends
  Omit<IncubatorFactoryEntity, 'id' | 'branch' | 'eggs' | 'totalEgg' | 'endedAt'|'type'> {
  readonly branchId: number;
  readonly eggTypeId: number;
}
