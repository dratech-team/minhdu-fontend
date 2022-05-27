import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentType} from '@minhdu-fontend/enums';
import {DatePipe} from '@angular/common';
import {NzModalRef} from "ng-zorro-antd/modal";
import {OrderEntity} from "../../../order/enitities/order.entity";
import {Actions} from "@datorama/akita-ng-effects";
import {PaymentActions} from "../../../payment/payment";
import {PaymentQuery} from "../../../payment/payment/payment.query";
import {ModalAddOrUpdatePayment} from "../../data/modal-payment.data";
import {BaseAddPaymentDto} from "../../../payment/dto/add-payment.dto";
import {BaseUpdatePaymentDto} from "../../../payment/dto/update-payment.dto";

@Component({
  templateUrl: 'payment-modal.component.html'
})

export class PaymentModalComponent implements OnInit {
  @Input() data!: ModalAddOrUpdatePayment
  orderPicked!: OrderEntity;
  payType = PaymentType;
  formGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  paidTotal!: number;
  indexStep = 0;
  added$ = this.paymentQuery.select(state => state.added)

  constructor(
    public datePipe: DatePipe,
    public modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly paymentQuery: PaymentQuery
    ,
  ) {
  }

  ngOnInit() {
    const paymentHistory = this.data?.update?.payment
    this.formGroup = this.formBuilder.group({
      payType: [paymentHistory?.payType, Validators.required],
      paidTotal: [paymentHistory?.total, Validators.required],
      paidAt: [paymentHistory?.paidAt, Validators.required],
      note: [paymentHistory?.note, Validators.required],
      customerId: [this.data.add?.customer.id || paymentHistory?.customer.id, Validators.required]
    });
    if (paymentHistory) {
      this.pickOrders(paymentHistory.order)
    }
  }

  onSubmit() {
    const infoPayment = this.mapPayment(this.formGroup.value)
    this.actions$.dispatch(
      this.data?.update ?
        PaymentActions.update({
          id: this.data.update.payment.id,
          updates: infoPayment
        })
        : PaymentActions.addOne({
          body: infoPayment
        })
    )

    this.added$.subscribe(val => {
      if (val) {
        this.modalRef.close()
      }
    })
  }

  pickOrders($event: OrderEntity) {
    this.orderPicked = $event;
    if (this.orderPicked) {
      this.secondFormGroup = this.formBuilder.group({
        pick: [true, Validators.required]
      });
    } else {
      this.secondFormGroup = this.formBuilder.group({
        pick: ['', Validators.required]
      });
    }
  }

  private mapPayment(val: any): BaseAddPaymentDto | BaseUpdatePaymentDto {
    return {
      payType: val.payType ? val.payType : undefined,
      total: val.paidTotal,
      paidAt: val.paidAt,
      orderId: this.orderPicked.id,
      note: val.note,
      customerId: val.customerId
    }
  }

}
