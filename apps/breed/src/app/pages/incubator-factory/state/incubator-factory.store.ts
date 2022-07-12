import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IncubatorFactoryEntity } from '../entities/incubator-factory.entity';

export interface IncubatorFactoryState
  extends EntityState<IncubatorFactoryEntity> {
  loading: boolean;
  branchId: number;
}

export const createInitialState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'incubator-factory' })
export class IncubatorFactoryStore extends EntityStore<IncubatorFactoryState> {
  constructor() {
    super(createInitialState());
  }
}
