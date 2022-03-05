import { QueryEntity } from '@datorama/akita';
import { CustomerState, CustomerStore } from './customer.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomerQuery extends QueryEntity<CustomerState> {
  constructor(protected store: CustomerStore) {
    super(store);
  }
}
