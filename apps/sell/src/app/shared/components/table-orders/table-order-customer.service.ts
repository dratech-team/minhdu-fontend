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
  loadInit(customerId:number){
    return this.store.dispatch(OrderAction.loadInit({take:30, skip: 0 ,customerId: customerId }))
  }
  scrollOrders(val: any){
    this.store.dispatch(OrderAction.loadMoreOrders(val));
  }
  searchOrders(val: any){
    this.store.dispatch(OrderAction.loadInit(val))
  }
  getCustomers() {
    return this.orders$
  }
}
