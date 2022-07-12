import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { SupplierEntity } from '../entities';

export interface SupplierState extends EntityState<SupplierEntity> {
  loading?: boolean;
  total: number;
}

export const createInitState = () => ({
  total: 0,
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'supplier' })
export class SupplierStore extends EntityStore<SupplierState> {
  constructor() {
    super(createInitState());
  }
}
