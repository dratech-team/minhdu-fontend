import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseOrderEntity } from '../../../order/enitities';
import { OrderActions, OrderQuery } from '../../../order/state';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ModeEnum } from '@minhdu-fontend/enums';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerQuery, CustomerStore } from '../../state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalDatePickerComponent } from '@minhdu-fontend/components';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import { arrayAdd, arrayRemove, arrayUpdate } from '@datorama/akita';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { OrderService } from '../../../order/service';

@Component({
  selector: 'order-list',
  templateUrl: 'order-list.component.html'
})
export class OrderListComponent implements OnInit {
  @Input() orders: BaseOrderEntity[] = [];
  @Input() delivered: boolean = false;
  @Input() customerId?: number;
  @Input() loading = false;

  @Output() onValueChanged = new EventEmitter<{
    search: Partial<{ ranges: Date[] | null, ward: string | null | undefined, explain: string | null | undefined }>,
    isSet: boolean
  }>();

  account$ = this.accQuery.selectCurrentUser();

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
    // search
    //tap((val) => {
    //         this.actions$.dispatch(
    //           CustomerActions.loadOrder({
    //             search: Object.assign({}, this.mapOrders(val), {
    //               hiddenDebt: StatusOrder.ALL
    //             }),
    //             isSet: true,
    //             typeOrder: this.delivered ? 'delivered' : 'delivering'
    //           })
    //         );
    this.formGroup.valueChanges.subscribe(formGroup => {
      this.onValueChanged.emit({
        search: formGroup, isSet: true
      });
    });
  }

  onLoadMore() {
    const val = this.formGroup.value;
    this.onValueChanged.emit({
      search: val, isSet: true
    });
    // this.actions$.dispatch(
    //   CustomerActions.loadOrder({
    //     search: Object.assign({}, this.mapOrders(val), {
    //       hiddenDebt: StatusOrder.ALL
    //     }),
    //     typeOrder: this.delivered ? 'delivered' : 'delivering',
    //     isSet: false
    //   })
    // );
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  updateOrder(order: BaseOrderEntity) {
    this.orderService.hide(order.id, { hide: !order.hide })
      .pipe(take(1))
      .subscribe((res) => {
        this.customerStore.update(this.customerId, ({ delivered }) => ({
          delivered: arrayUpdate(delivered, order.id, res)
        }));
      });
  }

  deleteOrder(order: BaseOrderEntity) {
    const ref = this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Đơn hàng đang giao',
        description: `hủy đơn hàng đang giao ${
          order?.ward ? order.ward.name : ''
        }
          ${order?.district ? order.district.name : ''} ${
          order?.province?.name
        }`
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(OrderActions.cancel({ id: order.id }));
      }
    });
  }

  confirmOrder(order: BaseOrderEntity) {
    this.modal
      .create({
        nzTitle: 'Xác nhận Giao hàng',
        nzContent: ModalDatePickerComponent,
        nzComponentParams: <{ data: ModalDatePickerEntity }>{
          data: {
            type: 'date',
            dateInit: new Date()
          }
        },
        nzFooter: []
      })
      .afterClose.subscribe((val) => {
      if (val) {
        this.orderService.update({ id: order.id, updates: { deliveredAt: new Date(val) } })
          .pipe(take(1))
          .subscribe((res) => {
            this.customerStore.update(this.customerId, ({ delivering, delivered }) => ({
              delivered: arrayAdd(delivered, res),
              delivering: arrayRemove(delivering, order.id)
            }));
          });
      }
    });
  }

  private mapOrders(val: any): any {
    return {
      delivered: this.delivered ? 1 : 0,
      createdAt: val.createdAt,
      ward: val.ward,
      explain: val.explain,
      customerId: this.customerId ? this.customerId : ''
    };
  }
}
