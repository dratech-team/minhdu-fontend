import { IncubatorFactoryEntity } from '../entities/incubator-factory.entity';

export interface SearchIncubatorFactoryDto extends Omit<IncubatorFactoryEntity, 'id' | 'branch'> {
  readonly take: number,
  readonly skip: number,
  readonly branchId: number;
}
