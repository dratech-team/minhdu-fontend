import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { StockState, StockStore } from './stock.store';

@Injectable({ providedIn: 'root' })
export class StockQuery extends QueryEntity<StockState> {
  constructor(protected store: StockStore) {
    super(store);
  }
}
