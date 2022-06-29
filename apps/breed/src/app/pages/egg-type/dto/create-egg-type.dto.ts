import { EggTypeEntity } from '../entities/egg-type.entity';

export type CreateEggTypeDto = Omit<EggTypeEntity, 'id'>;
