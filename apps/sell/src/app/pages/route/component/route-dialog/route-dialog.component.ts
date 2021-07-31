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
  orderIds: number[] = [];
  orders$ = this.store.pipe(select(selectorAllOrders))
  orders: Order[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrderAction.loadInit({take:30, skip: 0}))
    this.orders$.subscribe(val => {
      this.orders = JSON.parse(JSON.stringify(val))
    })
    console.log(this.orders)
    this.formGroup = this.formBuilder.group({
      name: [this?.data?.route?.name, Validators.required],
      startedAt: [this.datePipe.transform(
        this?.data?.route?.startedAt,'yyyy-MM-dd'), Validators.required],
      endedAt: [this.datePipe.transform(
        this?.data?.route?.endedAt,'yyyy-MM-dd'), Validators.required],
      bsx: [this?.data?.route?.bsx, Validators.required],
      latitude: [this?.data?.route?.latitude, Validators.required],
      longitude: [this?.data?.route?.longitude, Validators.required],
      driver: [this?.data?.route?.driver, Validators.required],
      garage: [this?.data?.route?.garage, Validators.required],
    });
  }


  pickOrders(orders: number[] ) {
    this.orderIds = orders;
  }

  onSubmit() {
    const val = this.formGroup.value;
    const route = {
      name: val.name,
      bsx: val.bsx,
      driver: val.driver,
      garage: val.garage,
      orderIds: this.orderIds
    };
    if (this.data) {
      this.store.dispatch(RouteAction.updateRoute({ route: route, id: this.data.route.id }));
    } else {
      this.store.dispatch(RouteAction.addRoute({ route: route }));
    }
  }
}
