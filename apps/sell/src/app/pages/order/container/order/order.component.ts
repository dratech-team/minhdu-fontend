import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllOrders } from '../+state/order.selector';
import { OrderAction } from '../+state/order.action';
import { OrderDialogComponent } from '../../component/order-dialog/order-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';


@Component({
  templateUrl: 'order.component.html'

})
export class OrderComponent implements OnInit {

  currencyUnit = CurrencyUnit;
  payType = PaymentType;
  orders = [
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },
    {
      customer:{
        firstName: 'tran',
        lastName:'Hieu'
      },
      paidAt: new Date(),
      createdAt: new Date(),
      explain:'ádasdasdasdsa',
      currency: CurrencyUnit.EUR,
      payType: PaymentType.TRANSFER,
      paidTotal: 111111,
    },

  ]
  // orders$ = this.store.pipe(select(selectorAllOrders))
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    // this.store.dispatch(OrderAction.loadInit({take:30, skip: 0}))
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
  detailOrder(){
    this.router.navigate(['order/detail-order']).then()
  }
}
