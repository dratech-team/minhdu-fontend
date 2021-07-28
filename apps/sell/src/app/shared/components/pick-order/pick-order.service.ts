import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllOrders } from '../../../pages/order/+state/order.selector';
import { OrderAction } from '../../../pages/order/+state/order.action';


@Injectable({providedIn: 'root'})
export class PickOrderService {
  orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store,
  ) {
  }
  loadInit(){
    return this.store.dispatch(OrderAction.loadInit({take:30, skip: 0 }))
  }
  scrollOrder(val: any){
    this.store.dispatch(OrderAction.loadMoreOrders(val));
  }
  searchOrder(val: any){
    this.store.dispatch(OrderAction.loadInit(val))
  }
  getOrders() {
    return this.orders$
  }
}
