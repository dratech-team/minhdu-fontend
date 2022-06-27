import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime, tap} from 'rxjs/operators';
import {ItemContextMenu, PaymentType} from '@minhdu-fontend/enums';
import {PaymentModalComponent} from '../payment-modal/payment-modal.component';
import {PaymentQuery} from "../../payment/payment.query";
import {Actions} from "@datorama/akita-ng-effects";
import {PaymentActions} from "../../payment";
import {PaymentStore} from "../../payment/payment.store";
import {PaymentEntity} from "../../entities/payment.entity";
import {NzModalService} from "ng-zorro-antd/modal";
import {DatePipe} from "@angular/common";
import {ModalAddOrUpdatePayment} from "../../../customer/data/modal-payment.data";

@Component({
  selector: 'minhdu-fontend-table-payment',
  templateUrl: 'table-payment.component.html'
})

export class TablePaymentComponent implements OnInit {
  @Input() customerId!: number;

  paymentHistories$ = this.paymentQuery.selectAll()
  loading$ = this.paymentQuery.select(state => state.loading)

  pageSizeTable = 10
  pageTypeEnum = ItemContextMenu;
  payType = PaymentType;

  formGroup = new UntypedFormGroup(
    {
      name: new UntypedFormControl(''),
      paidAt: new UntypedFormControl(''),
      createdAt: new UntypedFormControl('')
    });


  constructor(
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe,
    private readonly router: Router,
    private readonly paymentQuery: PaymentQuery,
    private readonly paymentStore: PaymentStore,
  ) {
  }

  ngOnInit() {
    this.onLoad(false)
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((_) => {
        this.onLoad(false)
      })).subscribe();
  }

  onLoadMore(pageIndex: number) {
    const count = this.paymentQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.onLoad(true)
    }
    this.onLoad(true)
  }

  onLoad(isPaginate: boolean) {
    this.actions$.dispatch(PaymentActions.loadAll({
      search: this.mapPayment(this.formGroup.value),
      isPaginate
    }))
  }

  mapPayment(value: any) {
    this.paymentStore.update(state => ({
      ...state, search: value
    }))
    return Object.assign({}, value, {customerId: this.customerId})
  }

  onDelete(payment: PaymentEntity) {
    this.modal.warning({
      nzTitle: 'Xoá lịch sử thanh toán',
      nzContent: `bạn có chắc chắn xoá lịch sử thanh toán ngày ${
        this.datePipe.transform(payment.paidAt, 'dd/MM/yyyy')
      } không`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(PaymentActions.remove({
          id: payment.id,
          customerId: payment.customerId,
          paidTotal: payment.total
        }))
        this.loading$.subscribe(loading => {
          if (loading === false) {
            this.onLoad(false)
          }
        })
      }
    })
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
    })
  }
}
