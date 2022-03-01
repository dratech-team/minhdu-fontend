import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CustomerEntity } from '../entities/customer.entity';
import { Injectable } from '@angular/core';

export interface CustomerState extends EntityState<CustomerEntity> {
  readonly loading: boolean;
}

const createInitState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'customer' })
export class CustomerStore extends EntityStore<CustomerState> {
  constructor() {
    super(createInitState);
  }
}
