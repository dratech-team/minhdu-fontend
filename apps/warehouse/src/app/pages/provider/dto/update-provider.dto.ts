import {ProviderEntity} from '../entities';

export type UpdateProviderDto = Partial<Omit<ProviderEntity, 'id'>>
