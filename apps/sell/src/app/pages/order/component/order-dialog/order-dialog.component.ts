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
import {NzMessageService} from "ng-zorro-antd/message";
import {Observable} from "rxjs";


@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  @Input() data: any
  customerId!: number
  payType = PaymentType;
  formGroup!: FormGroup;
  submitted = false;
  routes: number[] = [];
  customers: CustomerEntity[] = [];
  commoditiesSelected: CommodityEntity[] = [];
  districtId!: number;
  provinceId!: number
  stepIndex = 0

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly customerQuery: CustomerQuery,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    private readonly orderQuery: OrderQuery,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService
  ) {
  }

  ngOnInit() {
    if (this.data?.isUpdate) {
      this.customerId = this.data.order.customerId
      this.formGroup = this.formBuilder.group({
        createdAt: [this.datePipe.transform(
          this.data.order.createdAt, 'yyyy-MM-dd')
          , Validators.required],
        endedAt: [this.datePipe.transform(
          this.data.order?.endedAt, 'yyyy-MM-dd')],
        deliveredAt: [this.datePipe.transform(
          this.data.order?.deliveredAt, 'yyyy-MM-dd')],
        explain: [this.data.order?.explain],
        province: [this.data.order.province, Validators.required],
        district: [this.data.order?.district],
        ward: [this.data.order?.ward]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        createdAt: ['', Validators.required],
        deliveredAt: [],
        endedAt: [],
        explain: [],
        province: ['', Validators.required],
        district: [],
        ward: []
      });
    }

  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if(!this.data?.isUpdate){
      if (this.commoditiesSelected.length === 0) {
        return this.message.warning('Chưa chọn hàng hoá')
      }
    }
    const val = this.formGroup.value;
    const order = {
      customerId: this.customerId,
      commodityIds: this.commoditiesSelected.map(item => item.id),
      wardId: val?.ward?.id,
      districtId: val?.district?.id,
      provinceId: val.province.id,
      explain: val.explain,
      deliveredAt: val.deliveredAt,
      createdAt: val.createdAt,
      endedAt: val.endedAt
    };
    if (!val.deliveredAt) {
      delete order.deliveredAt;
    }
    if (this.data?.isUpdate) {
      this.actions$.dispatch(OrderActions.update({
        id: this.data.order.id,
        updates: order
      }));
    } else {
      this.actions$.dispatch(OrderActions.addOne(order))
    }
    this.orderQuery.select(state => state.added).subscribe(added => {
      if (added) {
        this.modalRef.close()
      }
    })
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): any {
    this.submitted = true;
    if (this.stepIndex === 0) {
      if (this.formGroup.invalid) {
        return;
      }
    }
    if (this.stepIndex === 1 && !this.customerId) {
      return this.message.warning('Chưa chọn khách hàng')
    }
    this.stepIndex += 1;
  }

  onPickCustomer(id: number) {
    this.customerId = id
  }

  onPickCommodity(commodities: CommodityEntity[]) {
    this.commoditiesSelected = commodities
  }

  adding(): Observable<boolean> {
    return this.orderQuery.select(state => state.adding)
  }
}
