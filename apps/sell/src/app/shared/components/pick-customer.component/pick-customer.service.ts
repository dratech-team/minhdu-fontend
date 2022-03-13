import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {CustomerActions} from '../../../pages/customer/+state/customer.actions';
import {CustomerQuery} from '../../../pages/customer/+state/customer.query';

@Injectable({providedIn: 'root'})
export class PickCustomerService {
  customers$ = this.customerQuery.selectAll();

  constructor(
    private readonly actions$: Store,
    private readonly customerQuery: CustomerQuery
  ) {
  }

  loadInit() {
    return this.actions$.dispatch(CustomerActions.loadAll({params: {take: 30, skip: 0}}));
  }

  scrollCustomer(val: any) {
    this.actions$.dispatch(CustomerActions.loadAll({params: val, isScroll: true}));
  }

  searchCustomer(val: any) {
    this.actions$.dispatch(CustomerActions.loadAll(val));
  }

  getCustomers() {
    return this.customers$;
  }
}
