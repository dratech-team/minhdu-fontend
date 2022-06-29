import { QueryEntity } from '@datorama/akita';
import { WarehouseState, WarehouseStore } from './warehouse.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WarehouseQuery extends QueryEntity<WarehouseState> {
  constructor(protected store: WarehouseStore) {
    super(store);
  }
}
