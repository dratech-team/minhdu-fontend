import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { OrderActions, OrderQuery } from '../../+state';
import { DatePipe } from '@angular/common';
import { CommodityQuery } from '../../../commodity/state';
import { CustomerQuery } from '../../../customer/+state';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityEntity } from '../../../commodity/entities';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  @Input() data: any;

  formGroup!: FormGroup;
  districtId!: number;
  provinceId!: number;

  loading$ = this.orderQuery.selectLoading();

  submitted = false;
  routes: number[] = [];
  stepIndex = 0;

  PaymentType = PaymentType;

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
    this.formGroup = this.formBuilder.group({
      createdAt: [
        this.datePipe.transform(this.data?.order?.createdAt, 'yyyy-MM-dd'),
        Validators.required
      ],
      endedAt: this.data?.order?.endedAt
        ? [this.datePipe.transform(this.data.order.endedAt, 'yyyy-MM-dd')]
        : [],
      deliveredAt: this.data?.order?.deliveredAt
        ? [this.datePipe.transform(this.data?.order?.deliveredAt, 'yyyy-MM-dd')]
        : [],
      explain: [this.data?.order?.explain],
      province: [this.data?.order?.province, Validators.required],
      district: [this.data?.order?.district],
      ward: [this.data?.order?.ward],
      customerId: [this.data?.order?.customerId],
      commodityIds: [
        this.data?.order?.commodities?.map((val: CommodityEntity) => val?.id)
      ]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (!this.data?.isUpdate) {
      if (this.formGroup.value.commodityIds.length == 0) {
        return this.message.warning('Chưa chọn hàng hoá');
      }
    }
    const val = this.formGroup.value;
    const order = {
      customerId: val.customerId,
      commodityIds: Array.from<number>(val.commodityIds),
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
    if (!order.districtId) {
      delete order.districtId;
    }
    if (!order.wardId) {
      delete order.wardId;
    }
    if (this.data?.isUpdate) {
      this.actions$.dispatch(
        OrderActions.update({
          id: this.data.order.id,
          updates: order
        })
      );
    } else {
      this.actions$.dispatch(OrderActions.addOne({ body: order }));
    }
    this.loading$.subscribe((loading) => {
      if (!loading) {
        this.modalRef.close();
      }
    });
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    if (this.stepIndex > 0 && !this.formGroup.value.customerId) {
      return this.message.warning('Chưa chọn khách hàng');
    }
    this.stepIndex += 1;
  }
}
