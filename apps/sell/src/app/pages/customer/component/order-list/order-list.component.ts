import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderEntity } from '../../../order/enitities';
import { OrderActions, OrderQuery } from '../../../order/state';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, take, tap } from 'rxjs/operators';
import { ModeEnum, StatusOrder } from '@minhdu-fontend/enums';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../state';
import { Observable } from 'rxjs';
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
  @Input() orders: OrderEntity[] = [];
  @Input() delivered: boolean = false;
  @Input() loading$!: Observable<boolean>;
  @Input() customerId?: number;

  account$ = this.accQuery.selectCurrentUser();

  formGroup = new UntypedFormGroup({
    createdAt: new UntypedFormControl(''),
    ward: new UntypedFormControl(''),
    explain: new UntypedFormControl('')
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
    this.orders = JSON.parse(JSON.stringify(this.orders));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          if (this.delivered) {
            this.actions$.dispatch(
              CustomerActions.loadOrder({
                search: Object.assign({}, this.mapOrders(val, true), {
                  hiddenDebt: StatusOrder.ALL
                }),
                typeOrder: 'delivered'
              })
            );
          } else {
            this.actions$.dispatch(
              CustomerActions.loadOrder({
                search: this.mapOrders(val),
                typeOrder: 'delivering'
              })
            );
          }
        })
      )
      .subscribe();
  }

  isPagination(pageIndex: number) {
    if (pageIndex * this.pageSizeTable >= this.orders.length) {
      const val = this.formGroup.value;
      if (this.delivered) {
        this.actions$.dispatch(
          CustomerActions.loadOrder({
            search: Object.assign({}, this.mapOrders(val, true), {
              hiddenDebt: StatusOrder.ALL
            }),
            typeOrder: 'delivered',
            isSet: true
          })
        );
      } else {
        this.actions$.dispatch(
          CustomerActions.loadOrder({
            search: this.mapOrders(val, true),
            typeOrder: 'delivering',
            isSet: true
          })
        );
      }
    }
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  updateOrder(order: OrderEntity) {
    this.orderService.hide(order.id, { hide: !order.hide })
      .pipe(take(1))
      .subscribe((res) => {
        this.customerStore.update(this.customerId, ({ delivered }) => ({
          delivered: arrayUpdate(delivered, order.id, res)
        }));
      });
  }

  deleteOrder(order: OrderEntity) {
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

  confirmOrder(order: OrderEntity) {
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

  private mapOrders(val: any, isPagination?: boolean): any {
    return {
      skip: isPagination ? this.orders.length : this.pageIndexInit,
      take: this.pageSize,
      delivered: this.delivered ? 1 : 0,
      createdAt: val.createdAt,
      ward: val.ward,
      explain: val.explain,
      customerId: this.customerId ? this.customerId : ''
    };
  }
}
