import { QueryEntity } from '@datorama/akita';
import { WarehouseState, CategoryStore } from './category.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class CategoryQuery extends QueryEntity<WarehouseState> {
  constructor(protected store: CategoryStore) {
    super(store);
  }
}
