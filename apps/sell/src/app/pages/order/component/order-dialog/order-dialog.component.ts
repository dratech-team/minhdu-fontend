import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { OrderAction } from '../../+state/order.action';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'order-dialog.component.html',
})
export class OrderDialogComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g')
  payType = PaymentType;
  CurrencyUnit = CurrencyUnit;
  customerId: number|undefined;
  formGroup!: FormGroup;
  routes: number[] = [];
  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(
        this?.data?.order?.createdAt,'yyyy-MM-dd')
        ,Validators.required],
      // currency: [this?.data?.order?.currency,Validators.required],
      explain: [this?.data?.order?.explain,Validators.required],
    })
  }
  pickCustomer(customerId:number){
    this.customerId = customerId
  }
  pickRoutes(routes: number[]){
    this.routes = routes
  }
  onSubmit(){
    const val = this.formGroup.value
    const order = {
      customerId: this.customerId,
      createdAt: new Date(val.createdAt),
      routes:this.routes,
      // currency: val.currency,
      explain: val.explain,
    }
    this.store.dispatch(OrderAction.updateOrder({order:order, id: this.data.order.id}))
  }
}
