import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { Order } from '../../../order/+state/order.interface';
import { DatePipe } from '@angular/common';
import { PaymentAction } from '../../+state/payment/payment.action';
import { OrderAction } from '../../../order/+state/order.action';
import {
  selectorAllOrders,
  selectorCurrentOrder,
  selectorOrdersByCustomerId
} from '../../../order/+state/order.selector';
import { tap } from 'rxjs/operators';
import { selectedAdded } from '../../+state/payment/payment.selector';


@Component({
  templateUrl: 'payment-dialog.component.html'
})

export class PaymentDialogComponent implements OnInit {
  orders$ = this.store.pipe(select(selectorOrdersByCustomerId(this.data.id)));
  numberChars = new RegExp('[^0-9]', 'g');
  ordersPicked!: Order;
  orderId!: number;
  payType = PaymentType;
  formGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  paidTotal!: number;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrderAction.loadInit({ customerId: this.data.id }));
    this.secondFormGroup = this.formBuilder.group({
      pick: ['', Validators.required]
    });
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        payType: [this.data.paymentHistory.payType, Validators.required],
        paidTotal: [this.data.paymentHistory.total, Validators.required],
        paidAt: [this.datePipe.transform(
          new Date(this.data.paymentHistory.paidAt), 'yyyy-MM-dd'
        ), Validators.required],
        note: [this.data.paymentHistory.note, Validators.required]
      });
      console.log(this.data.paymentHistory.orderId)
      this.pickOrders(this.data.paymentHistory.orderId)
    } else {
      this.formGroup = this.formBuilder.group({
        payType: [Validators.required],
        paidTotal: ['', Validators.required],
        paidAt: [this.datePipe.transform(
          new Date(), 'yyyy-MM-dd'
        ), Validators.required],
        note: ['Không', Validators.required]
      });
    }
    this.formGroup.valueChanges.pipe(
      tap(val => {
        this.paidTotal = typeof (val.paidTotal) === 'string' ? Number(val.paidTotal.replace(this.numberChars, '')) :
          val.paidTotal;
      })).subscribe();
  }

  onSubmit() {
    const val = this.formGroup.value;
    const infoPayment = {
      payType: val.payType ? val.payType : undefined,
      total: typeof (val.paidTotal) === 'string' ? Number(val.paidTotal.replace(this.numberChars, '')) : val.paidTotal,
      paidAt: val.paidAt,
      orderId: this.orderId,
      note: val.note
    };
    if (this.data?.isUpdate) {
      this.store.dispatch(PaymentAction.updatePayment(
        {
          id: this.data.paymentHistory.id,
          infoPayment: infoPayment
        })
      );
    } else {
      this.store.dispatch(PaymentAction.payment({ infoPayment: infoPayment }));
    }

    this.store.select(selectedAdded).subscribe(val => {
      if (val) {
        this.dialogRef.close();
      }
    });
  }

  check() {
    if (!this.formGroup.value.total) {
      const spanTotal = document.getElementById('total');
      spanTotal?.classList.add('required');
      const inputTotal = document.getElementById('input-total');
      inputTotal?.classList.add('required-input');
      setTimeout(function() {
        spanTotal?.classList.remove('required');
        inputTotal?.classList.remove('required-input');
      }, 500);
    }
  }

  pickOrders($event: number) {
    this.orderId = $event;
    this.store.pipe(select(selectorCurrentOrder(this.orderId))).subscribe(
      val => this.ordersPicked = JSON.parse(JSON.stringify(val))
    );
    if (this.orderId) {
      this.secondFormGroup = this.formBuilder.group({
        pick: [true,Validators.required]
      });
    } else {
      this.secondFormGroup = this.formBuilder.group({
        pick: ['', Validators.required]
      });
    }

  }

}
