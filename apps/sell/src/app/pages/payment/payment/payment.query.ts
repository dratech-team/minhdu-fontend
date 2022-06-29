import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PaymentState, PaymentStore } from './payment.store';

@Injectable({ providedIn: 'root' })
export class PaymentQuery extends QueryEntity<PaymentState> {
  constructor(protected store: PaymentStore) {
    super(store);
  }
}
