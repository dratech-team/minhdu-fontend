import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../+state/customer.action';
import { selectorCurrentCustomer } from '../../+state/customer.selector';
import { Customer } from '../../+state/customer.interface';
import { Order } from '../../../order/+state/order.interface';
import { DatePipe } from '@angular/common';


@Component({
  templateUrl: 'payment-dialog.component.html'
})

export class PaymentDialogComponent implements OnInit {
  customer$ = this.store.pipe(select(selectorCurrentCustomer(this?.data?.id)));
  numberChars = new RegExp('[^0-9]', 'g');
  customer!: Customer;
  orders: Order[] = [];
  orderId!: number;
  payType = PaymentType;
  formGroup!: FormGroup;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  customerIds: number[] = [];
  commodityIds: number[] = [];

  constructor(
    public datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.getCustomer({ id: this.data.id }));
    this.customer$.subscribe(val =>
      this.customer = JSON.parse(JSON.stringify(val))
    );
    this.formGroup = this.formBuilder.group({
      payType: [Validators.required],
      paidTotal: ['', Validators.required],
      paidAt: [this.datePipe.transform(
        new Date(), 'yyyy-MM-dd'
      ), Validators.required],
      note: ['Không', Validators.required]
    });
  }

  onSubmit() {
    const val = this.formGroup.value;
    const infoPayment = {
      payType: val.payType ? val.payType : undefined,
      total: typeof (val.paidTotal) === 'string' ? Number(val.paidTotal.replace(this.numberChars, '')) : val.paidTotal,
      paidAt: val.paidAt ,
      orderId: this.orderId,
      note: val.note
    };
    this.store.dispatch(CustomerAction.payment({ infoPayment: infoPayment, id: this.data.id }));
  }

  pickOrder($event: number) {
    this.orderId = $event;
  }
}
