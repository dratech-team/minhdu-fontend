import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentType} from '@minhdu-fontend/enums';
import {DatePipe} from '@angular/common';
import {NzModalRef} from "ng-zorro-antd/modal";
import {OrderEntity} from "../../../order/enitities/order.entity";
import {Actions} from "@datorama/akita-ng-effects";
import {PaymentActions} from "../../payment";
import {PaymentQuery} from "../../payment/payment.query";
import {ModalAddOrUpdatePayment} from "../../../customer/data/modal-payment.data";
import {BaseAddPaymentDto} from "../../dto/add-payment.dto";
import {BaseUpdatePaymentDto} from "../../dto/update-payment.dto";
import {PayTypeConstant} from "../../constants/pay-type.constant";

@Component({
  templateUrl: 'payment-modal.component.html'
})

export class PaymentModalComponent implements OnInit {
  @Input() data!: ModalAddOrUpdatePayment

  payTypeConstant = PayTypeConstant.filter(item => item.value !== PaymentType.ALL)
  orderPicked!: OrderEntity;
  formGroup!: FormGroup;
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
