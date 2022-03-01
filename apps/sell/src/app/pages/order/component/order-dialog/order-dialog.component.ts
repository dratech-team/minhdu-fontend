import {Component, Inject, OnInit} from '@angular/core';
import {AppState} from '../../../../reducers';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentType} from '@minhdu-fontend/enums';
import {OrderAction} from '../../+state/order.action';
import {DatePipe} from '@angular/common';
import {Customer} from '../../../customer/+state/customer.interface';
import {selectorAllCustomer} from '../../../customer/+state/customer/customer.selector';
import {CustomerAction} from '../../../customer/+state/customer.action';
import {CommodityAction} from '../../../commodity/+state/commodity.action';
import { CommodityQuery } from '../../../commodity/+state/commodity.query';
import { Commodity } from '../../../commodity/entities/commodity.entity';


@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  customers$ = this.store.pipe(select(selectorAllCustomer));
  commodities$ = this.commodityQuery.selectAll();
  payType = PaymentType;
  formGroup!: FormGroup;
  submitted = false;
  routes: number[] = [];
  customers: Customer[] = [];
  commoditiesSelected: Commodity[] = [];
  wardId!: number;

  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    private readonly dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly commodityQuery: CommodityQuery,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.loadInit({take: 30, skip: 0}));
    this.store.dispatch(CommodityAction.loadInit({CommodityDTO: {take: 30, skip: 0}}));

    this.customers$.subscribe(val => this.customers = JSON.parse(JSON.stringify(val)));
    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(
        this.data?.order?.createdAt, 'yyyy-MM-dd')
        , Validators.required],
      deliveredAt: [this.datePipe.transform(
        this.data?.order?.deliveredAt, 'yyyy-MM-dd')],
      explain: [this.data?.order?.explain],
      province: [this.data?.order?.province?.id, Validators.required],
      district: [this.data?.order?.district?.id],
      ward: [this.data?.order?.ward?.id]
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
      wardId: this.wardId || this.data.order?.ward?.id,
      explain: val.explain,
      deliveredAt: val.deliveredAt,
      typeUpdate: this.data.type
    };
    console.log(order)
    if (!val.deliveredAt) {
      delete order.deliveredAt;
    }
    this.store.dispatch(OrderAction.updateOrder({
      updateOrderDto: {
        order: order,
        id: this.data.order.id
      }
    }));
    this.dialogRef.close();
  }

  pickCommodity(commodities: Commodity[]) {
    this.commoditiesSelected = commodities;
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }
}
