import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { DatePipe } from '@angular/common';
import { Actions } from '@datorama/akita-ng-effects';
import { PaymentQuery } from '../../state';
import { ModalAddOrUpdatePayment } from '../../../customer/data/modal-payment.data';
import { PayTypeConstant } from '../../constants';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderEntity } from '../../../order/enitities';
import { NzModalRef } from 'ng-zorro-antd/modal';

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
    this.modalRef.close(infoPayment);
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
    if (type === 'next') {
      if (this.formGroup.value.order) {
        this.indexStep = 2;
      } else {
        this.indexStep += 1;
      }
    } else {
      if (this.formGroup.value.order) {
        this.indexStep = 0;
      } else {
        this.indexStep -= 1;
      }
    }
  }

  private mapPayment(val: any) {
    return {
      payType: val.payType ? val.payType : undefined,
      total: val.paidTotal,
      paidAt: val.paidAt,
      note: val.note,
      orderId: val.order.id,
    };
  }
}
