import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {PaidType} from 'libs/enums/paidType.enum';
import {Router} from '@angular/router';
import {TableRouteService} from './table-route.service';
import {RouteQuery} from '../../../route/+state';

@Component({
  selector: 'app-route-order',
  templateUrl: 'table-route.component.html'
})

export class TableRouteComponent implements OnInit {
  formGroup = new UntypedFormGroup(
    {
      name: new UntypedFormControl(''),
      startedAt: new UntypedFormControl(''),
      endedAt: new UntypedFormControl(''),
      paidType: new UntypedFormControl('')
    });
  paidType = PaidType;
  routes$ = this.routeQuery.selectAll();
  @Input() orderId!: number;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private readonly actions$: Store,
    private readonly routeQuery: RouteQuery,
    private readonly router: Router,
    private readonly service: TableRouteService
  ) {
  }

  ngOnInit() {
    this.service.loadInit(this.orderId);
  }

  onScroll() {
    const val = this.formGroup.value;
    this.service.scrollRoutes(this.orders(this.pageSize, this.pageIndex, val));
  }

  orders(pageSize: number, pageIndex: number, val?: any): any {
    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      customerId: this.orderId,
      paidType: val.paidType
    };
  }

  detailRoutes(id: number) {
    this.router.navigate(['/ban-hang/tuyen-duong/chi-tiet-tuyen-duong', id]).then();
  }
}
