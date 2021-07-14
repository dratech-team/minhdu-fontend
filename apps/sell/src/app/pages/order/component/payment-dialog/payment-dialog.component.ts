import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { OrderAction } from '../../+state/order.action';

@Component({
  templateUrl: 'payment-dialog.component.html',
})
export class PaymentDialogComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g')
  payType = PaymentType;
  CurrencyUnit = CurrencyUnit;
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
      payType: [Validators.required],
      paidTotal: [Validators.required],
      paidAt: [Validators.required],
    })
  }

  onSubmit(){
    const val = this.formGroup.value
    const order = {
      payType:val.payType ? val.payType: undefined,
      paidTotal: typeof(val.paidTotal) === 'string' ? Number(val.paidTotal.replace(this.numberChars,'')) : val.paidTotal,
      paidAt: this.data.type === 'PAYMENT'? new Date(val.paidAt): undefined,
    }
    this.store.dispatch(OrderAction.payment({order:order, id: this.data.order.id}))
  }
}
