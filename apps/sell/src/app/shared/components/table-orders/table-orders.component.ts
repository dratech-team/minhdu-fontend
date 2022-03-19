import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {PaidType} from 'libs/enums/paidType.enum';
import {Router} from '@angular/router';
import {OrderEntity} from '../../../pages/order/enitities/order.interface';
import {OrderActions} from '../../../pages/order/+state/order.actions';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, tap} from 'rxjs/operators';
import {ConvertBoolean} from '@minhdu-fontend/enums';
import {
  DialogSharedComponent
} from '../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {
  DialogDatePickerComponent
} from '../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import {Actions} from "@datorama/akita-ng-effects";
import {CustomerActions} from "../../../pages/customer/+state/customer.actions";
import {Observable} from "rxjs";

@Component({
  selector: 'app-table-order',
  templateUrl: 'table-orders.component.html'
})

export class TableOrdersComponent implements OnInit {
  @Input() orders!: OrderEntity[];
  @Input() delivered: boolean = false;
  @Input() loading$!: Observable<boolean>
  @Input() customerId?: number

  formGroup = new FormGroup(
    {
      createdAt: new FormControl(''),
      ward: new FormControl(''),
      explain: new FormControl('')
    });
  paidType = PaidType;
  pageSize = 10;
  pageIndexInit = 0;
  convertBoolean = ConvertBoolean;
  pageSizeTable = 4

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
          if (this.delivered) {
            this.actions$.dispatch(CustomerActions.loadOrder({
              params: this.mapOrders(val),
              typeOrder: 'delivered'
            }));
          } else {
            this.actions$.dispatch(CustomerActions.loadOrder({
              params: this.mapOrders(val),
              typeOrder: 'delivering'
            }));
          }
        }
      )
    ).subscribe();
  }

  isPagination(pageIndex: number) {
    if (pageIndex * this.pageSizeTable >= this.orders.length) {
      const val = this.formGroup.value;
      if (this.delivered) {
        this.actions$.dispatch(CustomerActions.loadOrder({
          params: this.mapOrders(val, true),
          typeOrder: 'delivered',
          isPagination: true
        }));
      } else {
        this.actions$.dispatch(CustomerActions.loadOrder({
          params: this.mapOrders(val, true),
          typeOrder: 'delivering',
          isPagination: true
        }));
      }
    }
  }

  mapOrders(val: any, isPagination?: boolean): any {
    return {
      skip: isPagination ? this.orders.length : this.pageIndexInit,
      take: this.pageSize,
      delivered: this.delivered ?
        this.convertBoolean.TRUE :
        this.convertBoolean.FALSE,
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
    this.actions$.dispatch(OrderActions.hide({
      id: order.id,
      hide: {hide: !order.hide}
    }));
  }

  deleteOrder(order: OrderEntity) {
    const ref = this.dialog.open(DialogSharedComponent,
      {
        width: 'fit-content',
        data: {
          title: 'Đơn hàng đang giao',
          description: `hủy đơn hàng đang giao ${order?.ward ? order.ward.name : ''}
          ${order?.district ? order.district.name : ''} ${order?.province?.name}`
        }
      });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(OrderActions.remove({id: order.id}));
      }
    });
  }

  confirmOrder(order: OrderEntity) {
    this.dialog.open(DialogDatePickerComponent, {
      width: 'fit-content',
      data: {
        titlePopup: 'Xác nhận giao hàng',
        title: 'Ngày giao hàng'
      }
    }).afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(OrderActions.update({
          id: order.id,
          updates: {
            deliveredAt: val.day,
          }
        }));
      }
    });
  }
}
