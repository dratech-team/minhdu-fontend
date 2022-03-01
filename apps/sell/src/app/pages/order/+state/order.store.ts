import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { OrderEntity } from '../entities/order.entity';
import { Injectable } from '@angular/core';

export interface OrderState extends EntityState<OrderEntity> {
  readonly loading: boolean;
}

const createInitState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'order' })
export class OrderStore extends EntityStore<OrderState> {
  constructor() {
    super(createInitState());
  }
}
