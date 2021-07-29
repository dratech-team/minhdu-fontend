import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { Order } from '../../../order/+state/order.interface';
import { DatePipe } from '@angular/common';
import { PaymentAction } from '../../+state/payment/payment.action';
import { OrderAction } from '../../../order/+state/order.action';
import { selectorAllOrders } from '../../../order/+state/order.selector';


@Component({
  templateUrl: 'payment-dialog.component.html'
})

export class PaymentDialogComponent implements OnInit {
  orders$ = this.store.pipe(select(selectorAllOrders));
  numberChars = new RegExp('[^0-9]', 'g');
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
    this.store.dispatch(OrderAction.loadInit({ take: 30, skip: 0, customerId: this.data.id}));
    this.orders$.subscribe(val =>
      this.orders = JSON.parse(JSON.stringify(val))
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
    this.store.dispatch(PaymentAction.payment({ infoPayment: infoPayment, id: this.data.id }));
  }

  pickOrder($event: number) {
    this.orderId = $event;
  }
}
