import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ProductState, StockStore } from './stock.store';

@Injectable({ providedIn: 'root' })
export class StockQuery extends QueryEntity<ProductState> {
  constructor(protected store: StockStore) {
    super(store);
  }
}
