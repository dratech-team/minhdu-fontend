import { BaseEntity } from '../../../../../../../libs/entities';

export interface BaseProviderEntity extends BaseEntity {
  readonly name: string;
  readonly code?: string;
}
