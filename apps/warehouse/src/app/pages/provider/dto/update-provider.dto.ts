import {ProviderEntity} from "../entities/provider.entity";

export type UpdateProviderDto = Partial<Omit<ProviderEntity, 'id'>>
