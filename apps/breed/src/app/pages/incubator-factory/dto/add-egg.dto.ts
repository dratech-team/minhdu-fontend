import { EggEntity } from '../entities/egg.entity';

export interface AddEggDto extends Omit<EggEntity, 'id'> {
  readonly incubatorId: number;
}
