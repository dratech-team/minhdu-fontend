import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ProviderEntity } from '../entities/provider.entity';

export interface ProviderState extends EntityState<ProviderEntity> {
  loading: boolean;
}

export const createInitState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'provider' })
export class ProviderStore extends EntityStore<ProviderState> {
  constructor() {
    super(createInitState());
  }
}
