import { IncubatorFactoryEntity } from '../entities/incubator-factory.entity';

export interface SearchIncubatorFactoryDto {
  readonly take: number,
  readonly skip: number,
  readonly branchId?: number;
  readonly startedAt?: Date;
  readonly endedAt?: Date;
}
