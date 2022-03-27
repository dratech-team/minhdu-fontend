import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RouteAction} from '../../+state/route.action';
import {DatePipe} from '@angular/common';
import {OrderEntity} from '../../../order/enitities/order.entity';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommodityEntity} from "../../../commodity/entities/commodity.entity";
import {Actions} from "@datorama/akita-ng-effects";
import {RouteQuery} from "../../+state/route.query";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Observable} from "rxjs";
import {RouteStore} from "../../+state/route.store";

@Component({
  templateUrl: 'route-dialog.component.html',
})
export class RouteDialogComponent implements OnInit {
  @Input() data?: any
  formGroup!: FormGroup;
  submitted = false;
  orderIdsOfRoute: OrderEntity[] = [];
  commoditySelected: CommodityEntity[] = []
  isSelectAll = false;
  stepIndex = 0;
  added$ = this.routeQuery.select(state => state.added)

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore,
    private readonly datePipe: DatePipe,
    private readonly modalRef: NzModalRef,
    private readonly snackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.routeStore.update(state => ({
      ...state, added: null
    }))
    if (this.data?.selectOrder) {
      this.stepIndex = 1;
    }

    if (this.data?.isUpdate) {
      this.orderIdsOfRoute = [...this.data.route.orders]
    }

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

  pickOrders(orders: OrderEntity[]) {
    this.orderIdsOfRoute = [...orders];
  }

  pickCommodity(commodities: CommodityEntity[]) {
    this.commoditySelected = [...commodities];
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.orderIdsOfRoute.length === 0) {
      return this.snackbar.open('Chưa chọn đơn hàng', '', {duration: 1500});
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
      commodityIds: this.commoditySelected.map((item) => item.id),
    };
    if (this.data) {
      this.actions$.dispatch(
        RouteAction.update({updates: route, id: this.data.route.id})
      );
    } else {
      this.actions$.dispatch(RouteAction.addOne(route));
    }
    this.added$.subscribe(added => {
      if (added) {
        this.modalRef.close();
      }
    })
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): void {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    this.stepIndex += 1;
  }
}
