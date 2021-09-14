import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllOrders } from '../../../pages/order/+state/order.selector';
import { OrderAction } from '../../../pages/order/+state/order.action';

@Injectable({providedIn: 'root'})
export class PickOrderService {
  constructor(
    private readonly store: Store,
  ) {
  }
  scrollOrder(val: any){
    this.store.dispatch(OrderAction.loadMoreOrders(val));
  }
  searchOrder(val: any){
    this.store.dispatch(OrderAction.loadInit(val))
  }
}
