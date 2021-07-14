import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import {  Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../../customer/+state/customer.action';
import { MatDialog } from '@angular/material/dialog';
import { OrderAction } from '../../+state/order.action';
import { PickCustomerComponent } from '../../../customer/component/pick-customer.component/pick-customer.component';
import { PickCommodityComponent } from '../../../commodity/component/pick-commodity/pick-commodity.component';
import { PickRoutesComponent } from '../../../route/component/pick-routes/pick-routes.component';

@Component({
  templateUrl: 'add-order.component.html',
})
export class AddOrderComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g')
  customerId!: number;
  commodityIds: number[] = [];
  routeIds: number[] = [];
  payType = PaymentType;
  CurrencyUnit = CurrencyUnit;
  isManyPeople = false;
  formGroup!: FormGroup;

  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required],
      currency: ['', Validators.required],
      explain: ['', Validators.required],
      payType: ['', Validators.required],
      paidTotal: ['', Validators.required],
      paidAt: ['', Validators.required],
    })
  }


  pickCustomers() {
    this.store.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }))
    const dialogRef = this.dialog.open(PickCustomerComponent, { width: '40%', data: { pickOne: true } })
    dialogRef.afterClosed().subscribe(val => this.customerId = val)
  }

  pickCommodities() {
    const dialogRef = this.dialog.open(PickCommodityComponent, { width: '70%', data: {type:'DIALOG'} })
    dialogRef.afterClosed().subscribe(val => this.commodityIds = val)
  }

  pickRoute(){
    const dialogRef = this.dialog.open(PickRoutesComponent, { width: '60%', data:{type:'DIALOG'} })
    dialogRef.afterClosed().subscribe(val => console.log(val))
  }

  onSubmit() {
    const val = this.formGroup.value
    const order = {
      createdAt: val.createdAt ? new Date(val.createdAt) : undefined,
      explain: val.explain,
      currency: val.currency,
      payType:val.payType ? val.payType: undefined,
      paidTotal: typeof(val.paidTotal) === 'string' ? Number(val.paidTotal.replace(this.numberChars, '')): val.paidTotal,
      paidAt:val.paidAt ? new Date(val.paidAt): undefined,
      customerId: this.customerId,
      commodityIds: this.commodityIds,
      routeIds: this.routeIds,
    }
      this.store.dispatch(OrderAction.addOrder({order:order}))
  }
}
