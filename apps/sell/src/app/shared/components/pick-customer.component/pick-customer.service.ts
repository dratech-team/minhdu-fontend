import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerAction } from '../../../pages/customer/+state/customer.action';
import { CustomerQuery } from '../../../pages/customer/+state/customer.query';

@Injectable({ providedIn: 'root' })
export class PickCustomerService {
  customers$ = this.customerQuery.selectAll();

  constructor(
    private readonly actions$: Store,
    private readonly customerQuery: CustomerQuery
  ) {
  }

  loadInit() {
    return this.actions$.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }));
  }

  scrollCustomer(val: any) {
    this.actions$.dispatch(CustomerAction.loadMoreCustomers(val));
  }

  searchCustomer(val: any) {
    this.actions$.dispatch(CustomerAction.loadInit(val));
  }

  getCustomers() {
    return this.customers$;
  }
}
