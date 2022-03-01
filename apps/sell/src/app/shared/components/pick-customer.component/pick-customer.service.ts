import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerAction } from '../../../pages/customer/+state/customer.action';

@Injectable({ providedIn: 'root' })
export class PickCustomerService {
  constructor(
    private readonly store: Store
  ) {
  }

  loadInit() {
    return this.store.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }));
  }

  scrollCustomer(val: any) {
    this.store.dispatch(CustomerAction.loadMoreCustomers(val));
  }

  searchCustomer(val: any) {
    this.store.dispatch(CustomerAction.loadInit(val));
  }
}
