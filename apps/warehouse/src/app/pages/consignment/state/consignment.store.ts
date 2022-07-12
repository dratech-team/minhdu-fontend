import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ConsignmentEntity } from '../entities';

export interface ConsignmentState extends EntityState<ConsignmentEntity> {
  loading?: boolean;
}

export function createInitialState(): ConsignmentState {
  return {
    loading: true,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'consignment' })
export class ConsignmentStore extends EntityStore<ConsignmentState> {
  constructor() {
    super(createInitialState());
  }
}
