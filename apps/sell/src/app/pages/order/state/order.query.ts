import { Order, QueryConfig, QueryEntity } from '@datorama/akita';
import { OrderState, OrderStore } from './order.store';
import { Injectable } from '@angular/core';
import { OrderEntity } from '../enitities/order.entity';

@Injectable({ providedIn: 'root' })
@QueryConfig<OrderEntity>({
  sortBy: "createdAt",
  sortByOrder: Order.DESC,
})
export class OrderQuery extends QueryEntity<OrderState> {
  constructor(protected store: OrderStore) {
    super(store);
  }
}
