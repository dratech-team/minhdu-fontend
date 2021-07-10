import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllOrders } from '../+state/order.selector';
import { OrderAction } from '../+state/order.action';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';


@Component({
  templateUrl: 'order.component.html'

})
export class OrderComponent implements OnInit {

  currencyUnit = CurrencyUnit;
  payType = PaymentType;
  orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    this.store.dispatch(OrderAction.loadInit({take:30, skip: 0}))
  }
  add(){
    this.router.navigate(['order/detail-order/add']).then()
  }
  onScroll() {
  }
  deleteOrder($event: any){

  }
  detailOrder(){
    this.router.navigate(['order/detail-order']).then()
  }
}
