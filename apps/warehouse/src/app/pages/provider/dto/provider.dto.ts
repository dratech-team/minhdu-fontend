import {ProviderEntity} from "../entities/provider.entity";

export interface ProviderDto extends Partial<Omit<ProviderEntity, 'id'>>{
 readonly take?: number;
 readonly skip?: number
}
