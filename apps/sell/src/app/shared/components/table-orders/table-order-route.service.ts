import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllOrders } from '../../../pages/order/+state/order.selector';
import { OrderAction } from '../../../pages/order/+state/order.action';

@Injectable({providedIn: 'root'})
export class TableOrderRouteService {
  orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store,
  ) {
  }
  loadInit(routeId?:number, customerId?:number){
    return this.store.dispatch(OrderAction.loadInit({take:30, skip: 0 ,routeId: routeId, customerId:customerId  }))
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
