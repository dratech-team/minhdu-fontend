import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { DatePipe } from '@angular/common';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Actions } from '@datorama/akita-ng-effects';
import { PaymentActions, PaymentQuery } from '../../state';
import { ModalAddOrUpdatePayment } from '../../../customer/data/modal-payment.data';
import { BaseAddPaymentDto, BaseUpdatePaymentDto } from '../../dto';
import { PayTypeConstant } from '../../constants';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderEntity } from '../../../order/enitities';

@Component({
  templateUrl: 'payment-modal.component.html'
})
export class PaymentModalComponent implements OnInit {
  @Input() data!: ModalAddOrUpdatePayment;
  loading$ = this.paymentQuery.select((state) => state.loading);

  payTypeConstant = PayTypeConstant.filter(
    (item) => item.value !== PaymentType.ALL
  );
  formGroup!: FormGroup;
  indexStep = 0;

  constructor(
    public datePipe: DatePipe,
    public modalRef: NzModalRef,
    private readonly actions$: Actions,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly message: NzMessageService,
    private readonly paymentQuery: PaymentQuery
  ) {
  }

  ngOnInit() {
    const paymentHistory = this.data?.update?.payment;

    this.formGroup = new FormGroup({
      payType: new FormControl<PaymentType>(paymentHistory?.payType || PaymentType.CASH, { validators: Validators.required }),
      paidTotal: new FormControl<number | undefined>(paymentHistory?.total, { validators: Validators.required }),
      paidAt: new FormControl<Date>(paymentHistory?.paidAt || new Date(), { validators: Validators.required }),
      note: new FormControl<string | undefined>(paymentHistory?.note),
      order: new FormControl<OrderEntity | undefined>(paymentHistory?.order || this.data.add?.order)
    });
  }

  onSubmit() {
    const infoPayment = this.mapPayment(this.formGroup.value);
    this.actions$.dispatch(
      this.data?.update
        ? PaymentActions.update({
          id: this.data.update.payment.id,
          updates: infoPayment
        })
        : PaymentActions.addOne({
          body: infoPayment
        })
    );

    this.loading$.subscribe((loading) => {
      if (loading === false) {
        this.modalRef.close(true);
      }
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  move(type: 'next' | 'previous'): any {
    if (this.formGroup.invalid) {
      return;
    }
    if (
      type === 'next' &&
      this.indexStep === 1 &&
      !this.formGroup.value.order
    ) {
      return this.message.error('Chưa chọn đơn hàng');
    }
    type === 'next' ? (this.indexStep += 1) : (this.indexStep -= 1);
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
    };
  }
}
