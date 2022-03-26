import {ProviderEntity} from '../entities';

export type AddProviderDto = Omit<ProviderEntity, 'id'>
