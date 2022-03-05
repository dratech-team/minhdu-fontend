import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CommodityUniq, Order } from '../enitities/order.interface';

export interface OrderState extends EntityState<Order> {
  readonly loading: boolean;
  readonly total: number;
  readonly commodityUniq: CommodityUniq[];
}

const createInitState = () => ({
  loading: true,
  total: 0,
  commodityUniq: []
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'order' })
export class OrderStore extends EntityStore<OrderState> {
  constructor() {
    super(createInitState());
  }
}
