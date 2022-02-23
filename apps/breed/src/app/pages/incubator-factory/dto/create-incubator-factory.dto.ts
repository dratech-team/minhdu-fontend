import { IncubatorFactoryEntity } from '../entities/incubator-factory.entity';

export interface CreateIncubatorFactoryDto extends Omit<IncubatorFactoryEntity, 'id' | 'branch'> {
  readonly branchId: number;
}
