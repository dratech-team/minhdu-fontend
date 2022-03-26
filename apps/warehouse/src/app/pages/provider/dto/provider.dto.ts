import {ProviderEntity} from '../entities';

export interface ProviderDto extends Partial<Omit<ProviderEntity, 'id'>>{
 readonly take?: number;
 readonly skip?: number
}
