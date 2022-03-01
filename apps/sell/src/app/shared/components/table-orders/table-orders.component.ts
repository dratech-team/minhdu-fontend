import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConvertBoolean, PaidType } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, tap } from 'rxjs/operators';
import { OrderEntity } from '../../../pages/order/entities/order.entity';
import { Actions } from '@datorama/akita-ng-effects';
import { DialogDatePickerComponent, DialogSharedComponent } from '@minhdu-fontend/components';
import { OrderAction } from '../../../pages/order/+state/order.action';

@Component({
  selector: 'app-table-order',
  templateUrl: 'table-orders.component.html'
})

export class TableOrdersComponent implements OnInit {
  @Input() orders: OrderEntity[] = [];
  @Input() delivered: boolean = false;
  @Input() customerId?: number;

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

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
  }

  //
  ngOnInit() {
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        }
      )
    ).subscribe();
  }

  onScroll() {
    const val = this.formGroup.value;
    if (this.delivered) {
      // this.customerService.scrollOrdersAssigned(this.orders(val));
    } else {
      this.actions$.dispatch(OrderAction.loadAll(this.mapOrder(val)));
    }
  }

  mapOrder(val: any): any {
    return {
      skip: this.pageIndexInit,
      take: this.pageSize,
      customerId: this.customerId,
      delivered: this.delivered ?
        this.convertBoolean.TRUE :
        this.convertBoolean.FALSE,
      createdAt: val.createdAt,
      ward: val.ward,
      explain: val.explain
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  updateOrder(order: OrderEntity) {
    this.actions$.dispatch(OrderAction.hide({
      id: order.id,
      hide: { hide: !order.hide }
    }));
  }

  deleteOrder(order: OrderEntity) {
    this.dialog.open(DialogSharedComponent,
      {
        width: 'fit-content',
        data: {
          title: 'Đơn hàng đang giao',
          description: `hủy đơn hàng đang giao ${order?.ward?.name} ${order?.ward?.district?.name} ${order?.ward?.district?.province?.name}`
        }
      }).afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(OrderAction.remove({ id: order.id }));
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
        this.actions$.dispatch(OrderAction.update({
          order: { deliveredAt: val.day },
          id: order.id,
          typeUpdate: 'IN_CUSTOMER'
        }));
      }
    });
  }
}
