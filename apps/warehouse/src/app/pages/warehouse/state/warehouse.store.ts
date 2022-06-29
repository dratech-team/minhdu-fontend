import { WarehouseEntity } from '../entities';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface WarehouseState extends EntityState<WarehouseEntity> {
  loading: boolean;
  selected?: number;
}

export function createInitialState(): WarehouseState {
  return {
    loading: true,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'warehouse' })
export class WarehouseStore extends EntityStore<WarehouseState> {
  constructor() {
    super(createInitialState());
  }
}
