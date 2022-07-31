import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderEntity } from '../../../order/enitities';
import { OrderQuery } from '../../../order/state';
import { MatDialog } from '@angular/material/dialog';
import { ModeEnum } from '@minhdu-fontend/enums';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerQuery, CustomerStore } from '../../state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { OrderService } from '../../../order/service';
import { OrderListData, OrderListFormType } from '../../data';
import { DatePipe } from '@angular/common';
import { OrderTypeEnum } from '../../enums';
import { RouterConstants } from '../../../../shared/constants';
import { HideDebtStatusEnum } from '../../../order/enums';

@Component({
  selector: 'order-list',
  templateUrl: 'order-list.component.html'
})
export class OrderListComponent implements OnInit {
  @Input() orders: OrderEntity[] = [];
  @Input() type: OrderTypeEnum = OrderTypeEnum.DELIVERING;
  @Input() customerId?: number;
  @Input() loading = false;

  @Output() onValueChanged = new EventEmitter<OrderListData>();
  @Output() onPayment = new EventEmitter<OrderEntity>();
  @Output() onDelivered = new EventEmitter<OrderEntity>();
  @Output() onCancelOrRestore = new EventEmitter<OrderEntity>();
  @Output() onHide = new EventEmitter<OrderEntity>();

  account$ = this.accQuery.selectCurrentUser();
  state$ = this.customerQuery.select();

  formGroup = new FormGroup({
    hiddenDebt: new FormControl<HideDebtStatusEnum>(HideDebtStatusEnum.ALL),
    createdAt: new FormControl<Date[] | null>(null),
    deliveredAt: new FormControl<Date[] | null>(null),
    province: new FormControl<string | null | undefined>(''),
    explain: new FormControl<string | null | undefined>('')
  });

  HideDebtEnum = HideDebtStatusEnum;
  OrderTypeEnum = OrderTypeEnum;
  ModeEnum = ModeEnum;
  pageSize = 10;
  pageIndexInit = 0;
  pageSizeTable = 4;

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly orderService: OrderService,
    private readonly customerStore: CustomerStore,
    private readonly customerQuery: CustomerQuery,
    private readonly orderQuery: OrderQuery,
    private readonly accQuery: AccountQuery,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe((formGroup) => {
      this.onValueChanged.emit({
        search: formGroup as OrderListFormType, isLoadMore: false
      });
    });
  }

  onLoadMore() {
    const value = this.formGroup.value;
    this.onValueChanged.emit({
      search: value as OrderListFormType, isLoadMore: true
    });
  }

  onDetail(id: number) {
    this.router.navigate([RouterConstants.ORDER.DETAIL, id]).then();
  }

  hide(order: OrderEntity) {
    this.onHide.emit(order);
  }

  cancel(order: OrderEntity) {
    this.onCancelOrRestore.emit(order);
  }

  onConfirm(order: OrderEntity) {
    this.onDelivered.emit(order);
  }

  payment(order: OrderEntity) {
    this.onPayment.emit(order);
  }

  orderLoading() {
    const state = this.customerQuery.getValue();
    if (this.type === OrderTypeEnum.DELIVERING) {
      return state.deliveringLoading;
    } else if (this.type === OrderTypeEnum.DELIVERED) {
      return state?.deliveredLoading;
    }
    return state.cancelledLoading;
  }

  orderRemaining(): number {
    const state = this.customerQuery.getValue();
    if (this.type === OrderTypeEnum.DELIVERING) {
      return state.deliveringRemain;
    } else if (this.type === OrderTypeEnum.DELIVERED) {
      return state.deliveredRemain;
    }
    return state.cancelledRemain;
  }

  tooltipRanges(type: 'createdAt' | 'deliveredAt') {
    const datetime = this.formGroup.value[type];
    return datetime?.length === 2
      ? (this.datePipe.transform(datetime[0], 'dd/MM/YYYY') + ' - ' + this.datePipe.transform(datetime[1], 'dd/MM/YYYY'))
      : '';
  }
}
