import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderEntity } from '../../../order/enitities';
import { OrderQuery } from '../../../order/state';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ModeEnum } from '@minhdu-fontend/enums';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerQuery, CustomerStore } from '../../state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { arrayUpdate } from '@datorama/akita';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { OrderService } from '../../../order/service';
import { SearchOrderDto } from '../../dto';

@Component({
  selector: 'order-list',
  templateUrl: 'order-list.component.html'
})
export class OrderListComponent implements OnInit {
  @Input() orders: OrderEntity[] = [];
  @Input() type: 'delivered' | 'delivering' | 'cancelled' = 'delivering';
  @Input() customerId?: number;
  @Input() loading = false;

  @Output() onValueChanged = new EventEmitter<SearchOrderDto>();
  @Output() onPayment = new EventEmitter<OrderEntity>();
  @Output() onDelivered = new EventEmitter<OrderEntity>();
  @Output() onCancel = new EventEmitter<OrderEntity>();

  account$ = this.accQuery.selectCurrentUser();
  state$ = this.customerQuery.select();

  formGroup = new FormGroup({
    ranges: new FormControl<Date[] | null>(null),
    ward: new FormControl<string | null | undefined>(''),
    explain: new FormControl<string | null | undefined>('')
  });

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
    private readonly accQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(formGroup => {
      this.onValueChanged.emit({
        search: formGroup, isLoadMore: false
      });
    });
  }

  onLoadMore() {
    const val = this.formGroup.value;
    this.onValueChanged.emit({
      search: val, isLoadMore: true
    });
  }

  onDetail(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  onUpdate(order: OrderEntity) {
    this.orderService.hide(order.id, { hide: !order.hide })
      .pipe(take(1))
      .subscribe((res) => {
        this.customerStore.update(this.customerId, ({ delivered }) => ({
          delivered: arrayUpdate(delivered, order.id, res)
        }));
      });
  }

  cancel(order: OrderEntity) {
    this.onCancel.emit(order);
  }

  onConfirm(order: OrderEntity) {
    this.onDelivered.emit(order);
  }

  payment(order: OrderEntity) {
    this.onPayment.emit(order);
  }

  orderLoading() {
    const state = this.customerQuery.getValue();
    if (this.type === 'delivering') {
      return state.deliveringLoading;
    } else if (this.type === 'delivered') {
      return state?.deliveredLoading;
    }
    return state.cancelledLoading;
  }

  orderRemaining() {
    const state = this.customerQuery.getValue();
    if (this.type === 'delivering') {
      return state.deliveringRemain > 0;
    } else if (this.type === 'delivered') {
      return state.deliveredRemain > 0;
    }
    return state.cancelledRemain > 0;
  }

  private mapOrders(val: any): any {
    return {
      delivered: this.type === 'delivered' ? 1 : 0,
      createdAt: val.createdAt,
      ward: val.ward,
      explain: val.explain,
      customerId: this.customerId ? this.customerId : ''
    };
  }
}
