import { BaseProviderEntity } from './base-provider.entity';

export interface ProviderEntity extends BaseProviderEntity {
  readonly name: string;
  readonly code?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly debt?: number;
  readonly total?: number;
}
