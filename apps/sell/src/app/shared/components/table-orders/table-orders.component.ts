import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormControl, FormGroup} from '@angular/forms';
import {PaidType} from 'libs/enums/paidType.enum';
import {Router} from '@angular/router';
import {TableOrderCustomerService} from './table-order-customer.service';
import {Observable} from 'rxjs';
import {Order} from '../../../pages/order/+state/order.interface';
import {OrderAction} from '../../../pages/order/+state/order.action';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, tap} from 'rxjs/operators';
import {ConvertBoolean} from '@minhdu-fontend/enums';
import {
  DialogSharedComponent
} from '../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {
  DialogDatePickerComponent
} from "../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component";

@Component({
  selector: 'app-table-order',
  templateUrl: 'table-orders.component.html'
})

export class TableOrdersComponent implements OnInit {
  @Input() orders$!: Observable<Order[]>;
  @Input() delivered!: boolean;
  @Input() customerId!: number;
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
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly customerService: TableOrderCustomerService
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
          if (this.delivered) {
            this.customerService.searchOrdersAssigned(this.orders(val));
          } else {
            this.customerService.searchOrders(this.orders(val));
          }
        }
      )
    ).subscribe();
  }

  onScroll() {
    const val = this.formGroup.value;
    if (this.delivered) {
      this.customerService.scrollOrdersAssigned(this.orders(val));
    } else {
      this.store.dispatch(OrderAction.loadMoreOrders({orderDTO: this.orders(val)}));
    }
  }

  orders(val: any): any {
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

  updateOrder(order: Order) {
    this.store.dispatch(OrderAction.updateHideOrder({
      id: order.id,
      hide: {hide: !order.hide},
      customerId: order.customerId
    }));
  }

  deleteOrder(order: Order) {
    const ref = this.dialog.open(DialogSharedComponent,
      {
        width: 'fit-content',
        data: {
          title: 'Đơn hàng đang giao',
          description: `hủy đơn hàng đang giao ${order?.ward?.name} ${order?.ward?.district?.name} ${order?.ward?.district?.province?.name}`
        }
      });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrderAction.deleteOrder({id: order.id, customerId: order.customerId}));
      }
    });
  }

  confirmOrder(order: Order) {
    this.dialog.open(DialogDatePickerComponent, {
      width: 'fit-content',
      data: {
        titlePopup: 'Xác nhận giao hàng',
        title: 'Ngày giao hàng',
      }
    }).afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrderAction.updateOrder({
          updateOrderDto:{
            order: {deliveredAt: val.day, customerId:order.customerId},
            id: order.id,
            typeUpdate: 'IN_CUSTOMER',
          }
        }))
      }
    })
  }
}
