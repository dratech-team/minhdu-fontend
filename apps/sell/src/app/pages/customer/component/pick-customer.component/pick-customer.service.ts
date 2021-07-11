import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllCustomer } from '../../+state/customer.selector';
import { CustomerAction } from '../../+state/customer.action';

@Injectable({providedIn: 'root'})
export class PickCustomerService {
  customers$ = this.store.pipe(select(selectorAllCustomer))
  constructor(
    private readonly store: Store,
  ) {
  }
  loadInit(){
    return this.store.dispatch(CustomerAction.loadInit({take:30, skip: 0}))
  }
  scrollCustomer(val: any){
    this.store.dispatch(CustomerAction.loadMoreCustomers(val));
  }
  searchCustomer(val: any){
    this.store.dispatch(CustomerAction.loadInit(val))
  }
  getCustomers() {
    return this.customers$
  }
}
