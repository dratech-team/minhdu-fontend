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
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ModalAddOrUpdatePayment } from '../../../customer/data';
import { ContextMenuEntity } from '@minhdu-fontend/data-models';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';

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

  menus: ContextMenuEntity[] = [
    {
      title: 'Sửa',
      click: (data: PaymentEntity) => this.onUpdate(data)
    },
    {
      title: 'Xoá',
      click: (data: PaymentEntity) => this.onRemove(data)
    }
  ];

  formGroup = new FormGroup({
    name: new FormControl<string>(''),
    paidAt: new FormControl<PaymentType>(PaymentType.ALL),
    ranges: new FormControl<Date[] | null>(null)
  });

  constructor(
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe,
    private readonly currencyPipe: CurrencyPipe,
    private readonly router: Router,
    private readonly paymentQuery: PaymentQuery,
    private readonly paymentStore: PaymentStore,
    private readonly nzContextMenuService: NzContextMenuService
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

  onRemove(payment: PaymentEntity) {
    this.modal.warning({
      nzTitle: 'Xoá lịch sử thanh toán',
      nzContent: `bạn có chắc chắn xoá lịch sử thanh toán ngày ${this.datePipe.transform(
        payment.paidAt,
        'dd/MM/yyyy'
      )} với số tiền là ${this.currencyPipe.transform(payment.total, "VND")} không`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(
          PaymentActions.remove({ id: payment.id })
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

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }
}
