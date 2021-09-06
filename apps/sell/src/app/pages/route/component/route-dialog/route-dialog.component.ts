import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { RouteAction } from '../../container/+state/route.action';
import { DatePipe } from '@angular/common';
import { selectorAllOrders } from '../../../order/+state/order.selector';
import { Order } from '../../../order/+state/order.interface';
import { OrderAction } from '../../../order/+state/order.action';

@Component({
  templateUrl: 'route-dialog.component.html'
})
export class RouteDialogComponent implements OnInit {
  formGroup!: FormGroup;
  orders$ = this.store.pipe(select(selectorAllOrders));
  orders: Order[] = [];
  orderIdsOfRoute: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {

    this?.data?.route?.orders.forEach((val: Order) => this.orderIdsOfRoute.push(val.id));
    this.store.dispatch(OrderAction.loadInit({ take: 30, skip: 0 }));
    this.orders$.subscribe(val => {
      this.orders = JSON.parse(JSON.stringify(val));
      this.orders.forEach(val => {
        if (this.orderIdsOfRoute.includes(val.id)) {
          Object.assign(val, { isSelect: true });
        } else {
          Object.assign(val, { isSelect: false });
        }

      });
    });

    this.formGroup = this.formBuilder.group({
      name: [this?.data?.route?.name, Validators.required],
      startedAt: [this.datePipe.transform(
        this?.data?.route?.startedAt, 'yyyy-MM-dd'), Validators.required],
      endedAt: [this.datePipe.transform(
        this?.data?.route?.endedAt, 'yyyy-MM-dd'), Validators.required],
      bsx: [this?.data?.route?.bsx, Validators.required],
      driver: [this?.data?.route?.driver, Validators.required],
      garage: [this?.data?.route?.garage, Validators.required]
    });
  }


  pickOrders(orders: number[]) {
    this.orderIdsOfRoute = orders;
  }

  onSubmit() {
    const val = this.formGroup.value;
    const route = {
      name: val.name,
      bsx: val.bsx,
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      driver: val.driver,
      garage: val.garage,
      orderIds: this.orderIdsOfRoute
    };
    if (this.data) {
      this.store.dispatch(RouteAction.updateRoute({ route: route, id: this.data.route.id }));
    } else {
      this.store.dispatch(RouteAction.addRoute({ route: route }));
    }
  }
}
