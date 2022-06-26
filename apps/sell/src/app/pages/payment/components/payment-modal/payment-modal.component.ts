import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {OrderEnum, PaymentType} from '@minhdu-fontend/enums';
import {DatePipe} from '@angular/common';
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {PaymentActions} from "../../payment";
import {PaymentQuery} from "../../payment/payment.query";
import {ModalAddOrUpdatePayment} from "../../../customer/data/modal-payment.data";
import {BaseAddPaymentDto} from "../../dto/add-payment.dto";
import {BaseUpdatePaymentDto} from "../../dto/update-payment.dto";
import {PayTypeConstant} from "../../constants/pay-type.constant";
import {OrderQuery} from "../../../order/+state";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  templateUrl: 'payment-modal.component.html'
})

export class PaymentModalComponent implements OnInit {
  @Input() data!: ModalAddOrUpdatePayment
  loading$ = this.paymentQuery.select(state => state.loading)

  payTypeConstant = PayTypeConstant.filter(item => item.value !== PaymentType.ALL)
  formGroup!: UntypedFormGroup;
  indexStep = 0;
  orderEnum = OrderEnum

  constructor(
    public datePipe: DatePipe,
    public modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly paymentQuery: PaymentQuery,
    private readonly orderQuery: OrderQuery,
    private readonly message: NzMessageService,
  ) {
  }

  ngOnInit() {
    const paymentHistory = this.data?.update?.payment
    this.formGroup = this.formBuilder.group({
      payType: [paymentHistory?.payType || PaymentType.CASH, Validators.required],
      paidTotal: [paymentHistory?.total, Validators.required],
      paidAt: [paymentHistory?.paidAt || new Date(), Validators.required],
      note: [paymentHistory?.note],
      order: [paymentHistory?.order],
    });
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

    this.loading$.subscribe(loading => {
      if (loading === false) {
        this.modalRef.close(true)
      }
    })
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  move(type: 'next' | 'previous'): any {
    console.log(this.formGroup.value)
    if (this.formGroup.invalid) {
      return
    }
    if (type === "next" && this.indexStep === 1 && !this.formGroup.value.order) {
      return this.message.error('Chưa chọn đơn hàng')
    }
    type === "next" ? this.indexStep += 1 : this.indexStep -= 1
  }

  private mapPayment(val: any): BaseAddPaymentDto | BaseUpdatePaymentDto {
    return {
      payType: val.payType ? val.payType : undefined,
      total: val.paidTotal,
      paidAt: val.paidAt,
      orderId: val.order.id,
      note: val.note,
      customerId: this.data.update
        ? this.data.update.payment.customerId
        : this.data.add.customer.id
    }
  }
}
