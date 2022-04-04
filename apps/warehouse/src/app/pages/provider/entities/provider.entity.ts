import { BaseProviderEntity } from '../bases/base-provider.entity';

export interface ProviderEntity extends BaseProviderEntity {
  readonly phone?: string;
  readonly email?: string;
  readonly debt?: number;
  readonly total?: number;
}
