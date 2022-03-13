import {Component, Inject, Input, OnInit} from '@angular/core';
import {AppState} from '../../../../reducers';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentType} from '@minhdu-fontend/enums';
import {OrderActions} from '../../+state/order.actions';
import {DatePipe} from '@angular/common';
import {CustomerEntity} from '../../../customer/entities/customer.entity';
import {CustomerActions} from '../../../customer/+state/customer.actions';
import {CommodityAction} from '../../../commodity/+state/commodity.action';
import {CommodityQuery} from '../../../commodity/+state/commodity.query';
import {CustomerQuery} from '../../../customer/+state/customer.query';
import {Actions} from "@datorama/akita-ng-effects";
import {CommodityEntity} from "../../../commodity/entities/commodity.entity";
import {NzModalRef} from "ng-zorro-antd/modal";
import {OrderQuery} from "../../+state/order.query";


@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  customers$ = this.customerQuery.selectAll();
  commodities$ = this.commodityQuery.selectAll();
  @Input() data: any
  payType = PaymentType;
  formGroup!: FormGroup;
  submitted = false;
  routes: number[] = [];
  customers: CustomerEntity[] = [];
  commoditiesSelected: CommodityEntity[] = [];
  wardId!: number;
  districtId!: number;
  provinceId!: number

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly customerQuery: CustomerQuery,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    private readonly orderQuery: OrderQuery,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit() {
    // this.actions$.dispatch(CustomerActions.loadAll({take: 30, skip: 0}));
    // this.actions$.dispatch(CommodityAction.loadInit({CommodityDTO: {take: 30, skip: 0}}));
    // this.customers$.subscribe(val => this.customers = JSON.parse(JSON.stringify(val)));
    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(
        this.data?.order?.createdAt, 'yyyy-MM-dd')
        , Validators.required],
      deliveredAt: [this.datePipe.transform(
        this.data?.order?.deliveredAt, 'yyyy-MM-dd')],
      explain: [this.data?.order?.explain],
      province: [this.data?.order?.province, Validators.required],
      district: [this.data?.order?.district],
      ward: [this.data?.order?.ward]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const val = this.formGroup.value;
    const order = {
      customerId: this.data.order.customerId,
      commodityIds: this.commoditiesSelected.map(item => item.id),
      wardId: val?.ward?.id,
      districtId: val?.district?.id,
      provinceId: val.province.id,
      explain: val.explain,
      deliveredAt: val.deliveredAt,
      typeUpdate: this.data.type
    };
    if (!val.deliveredAt) {
      delete order.deliveredAt;
    }
    this.actions$.dispatch(OrderActions.update({
      id: this.data.order.id,
      updates: order
    }));
    this.orderQuery.select(state => state.added).subscribe(added => {
      if (added) {
        this.modalRef.close()
      }
    })
  }

  pickCommodity(commodities: CommodityEntity[]) {
    this.commoditiesSelected = commodities;
  }
}
