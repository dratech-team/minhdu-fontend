import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BillState, BillStore } from './bill.store';

@Injectable({ providedIn: 'root' })
export class BillQuery extends QueryEntity<BillState> {
  constructor(protected store: BillStore) {
    super(store);
  }
}
