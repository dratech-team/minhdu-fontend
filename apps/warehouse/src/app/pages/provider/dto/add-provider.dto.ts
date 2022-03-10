import {ProviderEntity} from "../entities/provider.entity";

export type AddProviderDto = Omit<ProviderEntity, 'id'>
