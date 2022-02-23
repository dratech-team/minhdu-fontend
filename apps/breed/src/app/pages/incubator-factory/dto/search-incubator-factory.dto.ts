import { IncubatorFactoryEntity } from '../entities/incubator-factory.entity';

export interface SearchIncubatorFactoryDto extends Omit<IncubatorFactoryEntity, 'id' | 'branch'> {
  readonly branchId: number;
}
