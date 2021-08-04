import { Component, Input, OnInit } from '@angular/core';
import {  Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { Router } from '@angular/router';
import { TableOrderCustomerService } from './table-order-customer.service';
import { Observable } from 'rxjs';
import { Order } from '../../../pages/order/+state/order.interface';
import { TableOrderRouteService } from './table-order-route.service';

@Component({
  selector:'app-table-order',
  templateUrl:'table-orders.component.html',
})

export class TableOrdersComponent implements OnInit{
  @Input() orders$!: Observable<Order[]>
  @Input() delivered = 0;
  @Input() customerId!: number;
  formGroup = new FormGroup(
    {
      createdAt: new FormControl(''),
      paidType: new FormControl('')
    });
  paidType = PaidType;
  pageSize = 10;
  pageIndex = 1 ;
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly customerService: TableOrderCustomerService,
    private readonly routeService: TableOrderRouteService,
  ) {
  }
  ngOnInit() {
    this.orders$.subscribe(val =>   console.log(val))
  }
  onScroll(){
    if(this.delivered === 1){
      this.customerService.scrollOrdersAssigned(this.orders(this.pageSize, this.pageIndex ))
    }else{
      this.customerService.scrollOrders(this.orders(this.pageSize, this.pageIndex ))
    }
  }
  orders(pageSize: number, pageIndex: number, val?: any): any{
    return {
      take: pageSize,
      skip: pageSize* pageIndex++,
      customerId:this.customerId,
      delivered: this.delivered,
    }
  }
  detailOrder(id: number) {
      this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then()
  }
}
