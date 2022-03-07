import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CustomerEntity } from '../entities/customer.entity';

export interface CustomerState extends EntityState<CustomerEntity> {
  readonly loading: boolean;
  readonly deliveredLoading: boolean;
  readonly deliveringLoading: boolean;
}

const createInitState = () => ({
  loading: true,
  deliveredLoading: true,
  deliveringLoading: true,
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'customer' })
export class CustomerStore extends EntityStore<CustomerState> {
  constructor() {
    super(createInitState);
  }
}