import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, startWith } from 'rxjs/operators';
import { PaymentType } from '@minhdu-fontend/enums';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { PaymentActions, PaymentQuery, PaymentStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { PaymentEntity } from '../../entities';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { ModalAddOrUpdatePayment } from '../../../customer/data/modal-payment.data';

@Component({
  selector: 'minhdu-fontend-table-payment',
  templateUrl: 'table-payment.component.html'
})
export class TablePaymentComponent implements OnInit {
  @Input() customerId!: number;

  paymentHistories$ = this.paymentQuery.selectAll();
  loading$ = this.paymentQuery.select((state) => state.loading);
  remain$ = this.paymentQuery.select((state) => state.remain);

  payType = PaymentType;

  formGroup = new FormGroup({
    name: new FormControl<string>(''),
    paidAt: new FormControl<PaymentType>(PaymentType.ALL),
    createdAt: new FormControl<Date | null>(null)
  });

  constructor(
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe,
    private readonly router: Router,
    private readonly paymentQuery: PaymentQuery,
    private readonly paymentStore: PaymentStore
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges.pipe(
      debounceTime(1000), startWith(this.formGroup.value)
    ).subscribe((formGroup) => {
      this.actions$.dispatch(
        PaymentActions.loadAll({
          search: this.mapPayment(formGroup),
          isSet: true
        })
      );
    });
  }

  onLoadMore() {
    this.actions$.dispatch(
      PaymentActions.loadAll({
        search: this.mapPayment(this.formGroup.value),
        isSet: false
      })
    );
  }

  mapPayment(value: any) {
    this.paymentStore.update((state) => ({
      ...state,
      search: value
    }));
    return Object.assign({}, value, { customerId: this.customerId });
  }

  onDelete(payment: PaymentEntity) {
    this.modal.warning({
      nzTitle: 'Xoá lịch sử thanh toán',
      nzContent: `bạn có chắc chắn xoá lịch sử thanh toán ngày ${this.datePipe.transform(
        payment.paidAt,
        'dd/MM/yyyy'
      )} không`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(
          PaymentActions.remove({
            id: payment.id,
            customerId: payment.customerId,
            paidTotal: payment.total
          })
        );
      }
    });
  }

  onUpdate(payment: PaymentEntity) {
    this.modal.create({
      nzWidth: '70vw',
      nzTitle: 'Cập nhật thanh toán',
      nzContent: PaymentModalComponent,
      nzComponentParams: <{ data: ModalAddOrUpdatePayment }>{
        data: {
          update: {
            payment: payment
          }
        }
      },
      nzFooter: []
    });
  }
}
