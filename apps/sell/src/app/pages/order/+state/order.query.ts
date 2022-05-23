import {QueryEntity} from '@datorama/akita';
import {OrderState, OrderStore} from './order.store';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class OrderQuery extends QueryEntity<OrderState> {
  constructor(protected store: OrderStore) {
    super(store);
  }
}
