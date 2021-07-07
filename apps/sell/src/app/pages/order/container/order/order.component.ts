import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllOrders } from '../+state/order.selector';
import { OrderAction } from '../+state/order.action';
import { OrderDialogComponent } from '../../component/order-dialog/order-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: 'order.component.html'

})
export class OrderComponent implements OnInit {
  orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {
  }
  ngOnInit() {
    this.store.dispatch(OrderAction.loadInit({take:30, skip: 0}))
  }
  add(){
    this.dialog.open(OrderDialogComponent, {
      width: '40%',
    })
  }
  onScroll() {

  }
  deleteOrder($event: any){

  }
}
