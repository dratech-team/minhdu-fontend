import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { RouteAction } from '../../+state/route.action';
import { DatePipe } from '@angular/common';
import { selectorAllOrders } from '../../../order/+state/order.selector';
import { Order } from '../../../order/+state/order.interface';
import { OrderAction } from '../../../order/+state/order.action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'route-dialog.component.html',
})
export class RouteDialogComponent implements OnInit {
  formGroup!: FormGroup;
  submitted = false;
  orders$ = this.store.pipe(select(selectorAllOrders));
  orders: Order[] = [];
  orderIdsOfRoute: Order[] = [];
  isSelectAll = false;
  tabIndex = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly dialogRef: MatDialogRef<RouteDialogComponent>,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.data?.selectOrder) {
      this.tabIndex = 1;
    }
    this?.data?.route?.orders.forEach((val: Order) =>
      this.orderIdsOfRoute.push(val)
    );
    this.formGroup = this.formBuilder.group({
      name: [this.data?.route?.name, Validators.required],
      startedAt: [
        this.datePipe.transform(this.data?.route?.startedAt, 'yyyy-MM-dd'),
        Validators.required,
      ],
      endedAt: [
        this.datePipe.transform(this.data?.route?.endedAt, 'yyyy-MM-dd'),
      ],
      bsx: [this.data?.route?.bsx, Validators.required],
      driver: [this.data?.route?.driver, Validators.required],
      garage: [this.data?.route?.garage],
    });
  }

  pickOrders(orders: Order[]) {
    this.orderIdsOfRoute = orders;
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.orderIdsOfRoute.length === 0) {
      return this.snackbar.open('Chưa chọn đơn hàng', '', { duration: 1500 });
    }
    const val = this.formGroup.value;
    const route = {
      name: val.name,
      bsx: val.bsx,
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      driver: val.driver,
      garage: val.garage,
      orderIds: this.orderIdsOfRoute.map((item) => item.id),
    };
    if (this.data) {
      this.store.dispatch(
        RouteAction.updateRoute({ route: route, id: this.data.route.id })
      );
    } else {
      this.store.dispatch(RouteAction.addRoute({ route: route }));
    }
    this.dialogRef.close();
  }

  nextTab(tab: any) {
    this.tabIndex = tab._selectedIndex + 1;
  }

  previousTab(tab: any) {
    this.tabIndex = tab._selectedIndex - 1;
  }
}
