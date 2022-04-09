import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IoiReceiptState, IoiReceiptStore } from './ioi-receipt.store';

@Injectable({ providedIn: 'root' })
export class IoiReceiptQuery extends QueryEntity<IoiReceiptState> {
  constructor(protected store: IoiReceiptStore) {
    super(store);
  }
}
