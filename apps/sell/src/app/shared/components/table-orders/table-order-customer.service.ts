import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllOrders } from '../../../pages/order/+state/order.selector';
import { OrderAction } from '../../../pages/order/+state/order.action';

@Injectable({providedIn: 'root'})
export class TableOrderCustomerService {
  orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store,
  ) {
  }
  scrollOrders(val: any){
    this.store.dispatch(OrderAction.loadMoreOrders(val));
  }

  scrollOrdersAssigned(val: any){
    this.store.dispatch(OrderAction.loadMoreOrdersAssigned(val));
  }

  getCustomers() {
    return this.orders$
  }
}
