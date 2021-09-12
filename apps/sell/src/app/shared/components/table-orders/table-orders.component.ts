import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
      paidType: new FormControl('')
    });
  paidType = PaidType;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly customerService: TableOrderCustomerService
  ) {
  }

  ngOnInit() {
  }

  onScroll() {
    if (this.delivered) {
      this.customerService.scrollOrdersAssigned(this.orders(this.pageSize, this.pageIndex));
    } else {
      this.customerService.scrollOrders(this.orders(this.pageSize, this.pageIndex));
    }
  }

  orders(pageSize: number, pageIndex: number): any {
    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      customerId: this.customerId,
      delivered: this.delivered
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['/ban-hang/don-hang/chi-tiet-don-hang', id]).then();
  }

  updateOrder(order: Order) {
    const val = {
     hide:!order.hide
    };
    this.store.dispatch(OrderAction.updateOrder({
      order: val,
      id: order.id,
      typeUpdate: 'HIDE_DEBT'
    }));
  }
  deleteOrder(orderId: number){
    const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'})
    ref.afterClosed().subscribe(val => {
      if(val){
        this.store.dispatch(OrderAction.deleteOrder({id: orderId}))
      }
    })
  }
}
