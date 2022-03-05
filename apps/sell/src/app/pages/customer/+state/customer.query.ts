import { QueryEntity } from '@datorama/akita';
import { CustomerState, CustomerStore } from './customer.store';
import { Injectable } from '@angular/core';
import { Customer } from './customer.interface';

@Injectable({ providedIn: 'root' })
export class CustomerQuery extends QueryEntity<CustomerState> {
  constructor(protected store: CustomerStore) {
    super(store);
  }

  selectDelivered = (customerId: Customer['id']) => {
    return this.selectEntity(customerId, (entity) => entity?.delivered);
  };

  selectDelivering = (customerId: Customer['id']) => {
    return this.selectEntity(customerId, (entity) => entity?.delivering);
  };

}
