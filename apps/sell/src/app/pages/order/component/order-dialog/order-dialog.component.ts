import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentType} from '@minhdu-fontend/enums';
import {OrderActions} from '../../+state/order.actions';
import {DatePipe} from '@angular/common';
import {CustomerEntity} from '../../../customer/entities/customer.entity';
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
  @Input() data: any
  payType = PaymentType;
  formGroup!: FormGroup;
  submitted = false;
  routes: number[] = [];
  customers: CustomerEntity[] = [];
  commoditiesSelected: CommodityEntity[] = [];
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
}
