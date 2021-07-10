import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'order-dialog.component.html',
})
export class OrderDialogComponent implements OnInit {
  payType = PaymentType;
  CurrencyUnit = CurrencyUnit;
  isManyPeople = false;
  formGroup!: FormGroup;
  customerIds: number[] = [];
  commodityIds: number[] = [];
  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      createdAt: [this?.data?.order?.createdAt,Validators.required],
      currency: [this?.data?.order?.currency,Validators.required],
      explain: [this?.data?.order?.explain,Validators.required],
      payType: [this?.data?.order?.payType,Validators.required],
      paidAt: [this?.data?.order?.paidAt, Validators.required],
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

  onSubmit(){

  }
  pickCustomers(customerIds: number []): any {
    this.customerIds = customerIds;
  }
  pickCommodities(commodities: number []): any {
    this.commodityIds = commodities;
  }
}
