import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IoiReceipt, IoiReceiptStore } from './ioi-receipt.store';

@Injectable({ providedIn: 'root' })
export class IoiReceiptQuery extends QueryEntity<IoiReceipt> {
  constructor(protected store: IoiReceiptStore) {
    super(store);
  }
}
