import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';;
import { selectorAllOrders } from '../../../pages/order/+state/order.selector';
import { FormControl, FormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { TableOrderCustomerService } from './table-order-customer.service';
import { Observable } from 'rxjs';
import { Order } from '../../../pages/order/+state/order.interface';
import { TableOrderRouteService } from './table-order-route.service';

@Component({
  selector:'app-table-order',
  templateUrl:'table-orders.component.html',
})

export class TableOrdersComponent implements OnInit{
  orders$!: Observable<Order[]>
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      createdAt: new FormControl(''),
      paidType: new FormControl('')
    });
  paidType = PaidType;
  @Input() customerId!: number;
  @Input() routeId!: number;
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
    if(this.customerId){
      console.log('customerId',this.customerId)
      this.orders$ = this.customerService.getCustomers()
      this.customerService.loadInit(this.customerId)
      this.formGroup.valueChanges.pipe(
        debounceTime(1000),
        tap((value) => {
          this.customerService.searchOrders(this.orders(10,0, value))
        })).subscribe();
    }else {
      console.log('routeId', this.routeId)
      this.orders$ = this.routeService.getCustomers()
      this.routeService.loadInit(this.customerId)
      this.formGroup.valueChanges.pipe(
        debounceTime(1000),
        tap((value) => {
          this.routeService.searchOrders(this.orders(10,0, value))
        })).subscribe();
    }
  }
  onScroll(){
    const val = this.formGroup.value
    if(this.customerId){
      this.customerService.scrollOrders(this.orders(this.pageSize, this.pageIndex, val))
    }else{
      this.routeService.scrollOrders(this.orders(this.pageSize, this.pageIndex, val))
    }

  }
  orders(pageSize: number, pageIndex: number, val?: any): any{
    return {
      take: pageSize,
      skip: pageSize* pageIndex++,
      customerId:this.customerId,
      orderId: this.routeId,
      paidType: val.paidType
    }
  }
  detailOrder(id: number) {
      this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then()
  }
}
