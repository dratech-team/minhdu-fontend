import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouteActions, RouteQuery, RouteStore } from '../../state';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UpdaterRouteTypeEnum } from '../../enums/updater-route-type.enum';
import { SortTypeOrderEnum } from '@minhdu-fontend/enums';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { CommodityEntity } from '../../../commodity/entities';

@Component({
  templateUrl: 'route-dialog.component.html',
})
export class RouteDialogComponent implements OnInit {
  @Input() data?: any;
  loading$ = this.routeQuery.select((state) => state.loading);

  orderEnum = SortTypeOrderEnum;
  submitted = false;
  isSelectAll = false;
  stepIndex = 0;
  updateTypeEnum = UpdaterRouteTypeEnum;
  formGroup!: UntypedFormGroup;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore,
    private readonly datePipe: DatePipe,
    private readonly modalRef: NzModalRef,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.routeStore.update((state) => ({
      ...state,
      added: null,
    }));

    if (this.data?.updateType === UpdaterRouteTypeEnum.ORDER) {
      this.stepIndex = 1;
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
      orders: [this.data?.route?.orders],
      commodities: [[]],
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.value.orders.length === 0) {
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
      orderIds: val.orders.map((item: OrderEntity) => item.id),
      commodityIds: val.commodities?.map((item: CommodityEntity) => item.id),
    };
    if (this.data) {
      this.actions$.dispatch(
        RouteActions.update({ updates: route, id: this.data.route.id })
      );
    } else {
      this.actions$.dispatch(RouteActions.addOne({ body: route }));
    }
    this.loading$.subscribe((loading) => {
      if (loading === false) {
        this.modalRef.close();
      }
    });
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
