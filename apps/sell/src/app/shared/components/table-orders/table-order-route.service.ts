import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllOrders } from '../../../pages/order/+state/order.selector';
import { OrderActions } from '../../../pages/order/+state/order.actions';

@Injectable({providedIn: 'root'})
export class TableOrderRouteService {
  orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store,
  ) {
  }
  loadInit(routeId?:number, customerId?:number){
    return this.store.dispatch(OrderActions.loadAll({take:30, skip: 0 ,routeId: routeId, customerId:customerId  }))
  }
  scrollOrders(val: any){
    this.store.dispatch(OrderActions.loadMoreOrders(val));
  }
  searchOrders(val: any){
    this.store.dispatch(OrderActions.loadAll(val))
  }
  getCustomers() {
    return this.orders$
  }
}
