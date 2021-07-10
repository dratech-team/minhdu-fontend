import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import {  Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../../customer/+state/customer.action';
import { MatDialog } from '@angular/material/dialog';
import { PickCustomerComponent } from '../../../customer/component/pick-customer.component/pick-customer.component';
import { PickCommodityComponent } from '../../../commodity/component/pick-commodity.component/pick-commodity.component';
import { OrderAction } from '../+state/order.action';

@Component({
  templateUrl: 'add-order.component.html',
})
export class AddOrderComponent implements OnInit {
  customerId!: number;
  commodityIds: number[] = [];
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
    this.store.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }))
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required],
      currency: ['', Validators.required],
      explain: ['', Validators.required],
    })
  }

  tabChanged($event: MatTabChangeEvent) {
    switch ($event.index) {
      case 2:
        this.isManyPeople = true;
        break;
      default:
        this.isManyPeople = false;
    }
  }

  pickCustomers() {
    const dialogRef = this.dialog.open(PickCustomerComponent, { width: '40%', data: { pickOne: true } })
    dialogRef.afterClosed().subscribe(val => this.customerId = parseInt(val))
  }

  pickCommodities() {
    const dialogRef = this.dialog.open(PickCommodityComponent, { width: '60%', data: {type:'DIALOG'} })
    dialogRef.afterClosed().subscribe(val => this.commodityIds = val)
  }

  pickRoute(){
    const dialogRef = this.dialog.open(PickCommodityComponent, { width: '60%', data:{pickOne: true} })
    dialogRef.afterClosed().subscribe(val => this.commodityIds = val)
  }

  onSubmit() {
    const val = this.formGroup.value
    const order = {
      createdAt: val.createdAt ? new Date(val.createdAt) : undefined,
      explain: val.explain,
      currency: val.currency,
      payType: val.payType,
      paidTotal: val.paidTotal,
      customerId: this.customerId,
      commodityIds: this.commodityIds,
    }
      this.store.dispatch(OrderAction.addOrder({order:order}))
  }
}
