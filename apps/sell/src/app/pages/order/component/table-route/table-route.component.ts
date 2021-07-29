import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { Router } from '@angular/router';
import { TableRouteService } from './table-route.service';
import { selectorAllRoute } from '../../../route/container/+state/Route.selector';

@Component({
  selector:'app-route-order',
  templateUrl:'table-route.component.html',
})

export class TableRouteComponent implements OnInit{
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      startedAt: new FormControl(''),
      endedAt: new FormControl(''),
      paidType: new FormControl('')
    });
  paidType = PaidType;
  routes$ = this.store.pipe(select(selectorAllRoute))
  @Input() orderId!: number;
  pageSize = 10;
  pageIndex = 1 ;
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly service: TableRouteService,
  ) {
  }
  ngOnInit() {
    this.service.loadInit(this.orderId)
  }
  onScroll(){
    const val = this.formGroup.value
    this.service.scrollRoutes(this.orders(this.pageSize, this.pageIndex, val))
  }
  orders(pageSize: number, pageIndex: number, val?: any): any{
    return {
      take: pageSize,
      skip: pageSize* pageIndex++,
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      customerId:this.orderId,
      paidType: val.paidType
    }
  }
  detailRoutes(id: number) {
      this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id]).then()
  }
}
