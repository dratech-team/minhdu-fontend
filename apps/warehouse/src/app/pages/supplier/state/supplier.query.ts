import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SupplierState, SupplierStore } from './supplier.store';

@Injectable({ providedIn: 'root' })
export class SupplierQuery extends QueryEntity<SupplierState> {
  constructor(protected store: SupplierStore) {
    super(store);
  }
}
