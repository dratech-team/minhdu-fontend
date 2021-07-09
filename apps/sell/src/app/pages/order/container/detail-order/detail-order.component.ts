import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorCurrentOrder } from '../+state/order.selector';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../+state/order.interface';
import { PaymentType } from '@minhdu-fontend/enums';

@Component({
  templateUrl:'detail-order.component.html',
})
export class DetailOrderComponent implements OnInit {
  // order$ = this.store.pipe(select(selectorCurrentOrder(this.getOrderId)))
  order!: Order
  payType =  PaymentType;
  constructor(
    private readonly store: Store<AppState>,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }
  ngOnInit() {
  }
  get getOrderId():number{
    return this.activatedRoute.snapshot.params.id;
  }
  updateOrder(order:Order){

  }
}
