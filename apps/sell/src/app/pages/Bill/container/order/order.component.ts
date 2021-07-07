import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllOrders } from '../+state/order.selector';
import { OrderAction } from '../+state/order.action';

@Component({
  templateUrl: 'order.component.html'

})
export class OrderComponent implements OnInit {
  orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store<AppState>
  ) {
  }
  ngOnInit() {
    this.store.dispatch(OrderAction.loadInit({take:30, skip: 0}))
  }
  add(){

  }
  onScroll() {

  }
  deleteOrder($event: any){

  }
}
