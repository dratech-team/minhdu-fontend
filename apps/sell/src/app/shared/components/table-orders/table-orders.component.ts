import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { Router } from '@angular/router';
import { TableOrderCustomerService } from './table-order-customer.service';
import { Observable } from 'rxjs';
import { Order } from '../../../pages/order/+state/order.interface';
import { OrderAction } from '../../../pages/order/+state/order.action';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { debounceTime, tap } from 'rxjs/operators';
import { ConvertBoolean } from '@minhdu-fontend/enums';


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
      destination: new FormControl(''),
      explain: new FormControl('')
    });
  paidType = PaidType;
  pageSize = 10;
  pageIndex = 1;
  pageIndexInit = 0;
  totalOrder = Number(localStorage.getItem('totalOrder'));
  totalOrderStore!: number;
  convertBoolean = ConvertBoolean;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly customerService: TableOrderCustomerService
  ) {
  }

  ngOnInit() {
    this.orders$.subscribe(val => this.totalOrderStore = val.length);
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
          if (this.delivered) {
            this.customerService.searchOrdersAssigned(this.orders(val, this.pageSize, this.pageIndexInit));
          } else {
            this.customerService.searchOrders(this.orders(val, this.pageSize, this.pageIndexInit));
          }
        }
      )
    ).subscribe();
  }

  onScroll() {
    if (this.totalOrderStore < this.totalOrder) {
      console.log(this.totalOrderStore)
      const val = this.formGroup.value;
      if (this.delivered) {
        this.customerService.scrollOrdersAssigned(this.orders(val, this.pageSize, this.pageIndex));
      } else {
        this.customerService.scrollOrders(this.orders(val, this.pageSize, this.pageIndex));
      }
    }
  }

  orders(val: any, pageSize: number, pageIndex: number): any {
    pageIndex === 0 ? this.pageIndex = 1 : this.pageIndex++;
    return {
      skip: pageSize * pageIndex,
      take: pageSize,
      customerId: this.customerId,
      delivered: this.delivered ?
        this.convertBoolean.TRUE :
        this.convertBoolean.FALSE,
      createdAt: val.createdAt,
      destination: val.destination,
      explain: val.explain
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  updateOrder(order: Order) {
    const val = {
      hide: !order.hide
    };
    this.store.dispatch(OrderAction.updateOrder({
      order: val,
      id: order.id,
      typeUpdate: 'HIDE_DEBT'
    }));
  }

  deleteOrder(order: Order) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrderAction.deleteOrder({ id: order.id, customerId: order.customerId }));
      }
    });
  }
}
