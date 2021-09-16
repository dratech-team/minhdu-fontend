import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { OrderAction } from '../../+state/order.action';
import { DatePipe } from '@angular/common';
import { Customer } from '../../../customer/+state/customer/customer.interface';
import { selectorAllCustomer } from '../../../customer/+state/customer/customer.selector';
import { CustomerAction } from '../../../customer/+state/customer/customer.action';
import { selectAllCommodity } from '../../../commodity/+state/commodity.selector';
import { Commodity } from '../../../commodity/+state/commodity.interface';
import { CommodityAction } from '../../../commodity/+state/commodity.action';


@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  customers$ = this.store.pipe(select(selectorAllCustomer));
  commodities$ = this.store.pipe(select(selectAllCommodity));
  payType = PaymentType;
  formGroup!: FormGroup;
  routes: number[] = [];
  customers: Customer[] = [];
  commodities: Commodity[] = [];
  commodityIds: number[] = [];

  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }));
    this.store.dispatch(CommodityAction.loadInit({ take: 30, skip: 0 }));
    this.customers$.subscribe(val => this.customers = JSON.parse(JSON.stringify(val)));
    this.commodities$.subscribe(val => this.commodities = JSON.parse(JSON.stringify(val)));
    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(
        this.data?.order?.createdAt, 'yyyy-MM-dd')
        , Validators.required],
      deliveredAt:  [this.datePipe.transform(
        this.data?.order?.deliveredAt, 'yyyy-MM-dd')
        , Validators.required],
      explain: [this.data?.order?.explain],
      nation: [this.data?.order?.destination?.district?.province?.nation?.id, Validators.required],
      province: [this.data?.order?.destination?.district?.province?.id, Validators.required],
      district: [this.data?.order?.destination?.district?.id, Validators.required],
      ward: [this.data?.order?.destination?.id, Validators.required]
    });
  }


  onSubmit() {
    const val = this.formGroup.value;
    const order = {
      customerId: this.data.order.customerId,
      commodityIds: this.commodityIds,
      wardId: val.ward,
      explain: val.explain,
      deliveredAt: val.deliveredAt
    };
    if(!val.deliveredAt){
      delete order.deliveredAt
    }
    this.store.dispatch(OrderAction.updateOrder({ order: order, id: this.data.order.id, typeUpdate: this.data.type }));
  }

  pickCommodity(commodityIds: number[]) {
    this.commodityIds = commodityIds;
  }
}
