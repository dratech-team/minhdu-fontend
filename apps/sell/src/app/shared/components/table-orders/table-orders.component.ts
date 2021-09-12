import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PaidType } from 'libs/enums/paidType.enum';
import { Observable } from 'rxjs';
import { OrderAction } from '../../../pages/order/+state/order.action';
import { Order } from '../../../pages/order/+state/order.interface';
import { TableOrderCustomerService } from './table-order-customer.service';

@Component({
  selector: 'app-table-order',
  templateUrl: 'table-orders.component.html',
})
export class TableOrdersComponent implements OnInit {
  @Input() orders$!: Observable<Order[]>;
  @Input() delivered = 0;
  @Input() customerId!: number;
  lstOrder: Order[] = [];
  formGroup = new FormGroup({
    createdAt: new FormControl(''),
    paidType: new FormControl(''),
  });
  paidType = PaidType;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly customerService: TableOrderCustomerService
  ) {}

  ngOnInit() {
    this.orders$.subscribe((val) => {
      val.forEach((v) => {
        console.log(v.id, v.hide);
      });
    });
  }

  onScroll() {
    if (this.delivered === 1) {
      this.customerService.scrollOrdersAssigned(
        this.orders(this.pageSize, this.pageIndex)
      );
    } else {
      this.customerService.scrollOrders(
        this.orders(this.pageSize, this.pageIndex)
      );
    }
  }

  orders(pageSize: number, pageIndex: number): any {
    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      customerId: this.customerId,
      delivered: this.delivered,
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['/ban-hang/don-hang/chi-tiet-don-hang', id]).then();
  }

  updateOrder(order: Order) {
    console.log(!order.hide)
    const val = {
      hide: !order.hide,
    };
    this.store.dispatch(
      OrderAction.updateOrder({
        order: val,
        id: order.id,
        typeUpdate: 'HIDE_DEBT',
      })
    );
  }
}
