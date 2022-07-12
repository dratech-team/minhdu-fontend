import { EggTypeEntity } from '../entities/egg-type.entity';

export type SearchEggTypeDto = Omit<EggTypeEntity, 'id'>;
