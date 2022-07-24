import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { Router } from '@angular/router';
import { OrderEntity } from '../../../pages/order/enitities/order.entity';
import { OrderActions } from '../../../pages/order/state';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, tap } from 'rxjs/operators';
import { ConvertBoolean, StatusOrder } from '@minhdu-fontend/enums';
import { DialogSharedComponent } from '../../../../../../../libs/components/src/lib/dialog-shared';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerActions } from '../../../pages/customer/state';
import { Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalDatePickerComponent } from '@minhdu-fontend/components';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';

@Component({
  selector: 'order-list',
  templateUrl: 'order-list.component.html'
})
export class OrderListComponent implements OnInit {
  @Input() orders!: OrderEntity[];
  @Input() delivered: boolean = false;
  @Input() loading$!: Observable<boolean>;
  @Input() customerId?: number;

  formGroup = new UntypedFormGroup({
    createdAt: new UntypedFormControl(''),
    ward: new UntypedFormControl(''),
    explain: new UntypedFormControl('')
  });
  paidType = PaidType;
  pageSize = 10;
  pageIndexInit = 0;
  convertBoolean = ConvertBoolean;
  pageSizeTable = 4;

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService
  ) {
  }

  ngOnInit() {
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

  mapOrders(val: any, isPagination?: boolean): any {
    return {
      skip: isPagination ? this.orders.length : this.pageIndexInit,
      take: this.pageSize,
      delivered: this.delivered
        ? this.convertBoolean.TRUE
        : this.convertBoolean.FALSE,
      createdAt: val.createdAt,
      ward: val.ward,
      explain: val.explain,
      customerId: this.customerId ? this.customerId : ''
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  updateOrder(order: OrderEntity) {
    this.actions$.dispatch(
      OrderActions.hide({
        id: order.id,
        hide: { hide: !order.hiddenDebt }
      })
    );
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
        this.actions$.dispatch(
          OrderActions.update({
            id: order.id,
            updates: {
              deliveredAt: new Date(val)
            }
          })
        );
      }
    });
  }
}
