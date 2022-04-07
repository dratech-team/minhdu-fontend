import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {SupplierEntity} from '../entities/supplier.entity';

export interface SupplierState extends EntityState<SupplierEntity> {
  loading: boolean;
  added: boolean|null;
  total: number;
}

export const createInitState = () => ({loading: true, added: null, total: 0});

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'supplier'})
export class SupplierStore extends EntityStore<SupplierState> {
  constructor() {
    super(createInitState());
  }
}
