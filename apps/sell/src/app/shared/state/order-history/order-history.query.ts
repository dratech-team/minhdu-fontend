import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { OrderHistoryState, OrderHistoryStore } from './order-history.store';

@Injectable({ providedIn: 'root' })
export class OrderHistoryQuery extends Query<OrderHistoryState> {

  constructor(protected store: OrderHistoryStore) {
    super(store);
  }

}
