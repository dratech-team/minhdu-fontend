import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { OrderActions, OrderQuery } from '../../state';
import { DatePipe } from '@angular/common';
import { CommodityQuery } from '../../../commodity/state';
import { CustomerQuery } from '../../../customer/state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { District, Province, Ward } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../enitities/order.entity';

@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  @Input() data?: Partial<{
    order: OrderEntity,
    tab: number,
    customerId?: number,
    isUpdate: boolean
  }>;

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
    this.formGroup = new FormGroup({
      createdAt: new FormControl(
        this.datePipe.transform(this.data?.order?.createdAt, 'yyyy-MM-dd'),
        { validators: Validators.required }
      ),
      endedAt: this.data?.order?.endedAt
        ? new FormControl<string | null>(
          this.datePipe.transform(this.data?.order?.endedAt, 'yyyy-MM-dd'),
          { validators: Validators.required }
        )
        : new FormControl(),
      deliveredAt: this.data?.order?.deliveredAt
        ? new FormControl<string | null>(
          this.datePipe.transform(this.data?.order?.deliveredAt, 'yyyy-MM-dd'),
          { validators: Validators.required }
        )
        : new FormControl(),
      explain: new FormControl<string | undefined>(this.data?.order?.explain),
      province: new FormControl<Province | undefined>(this.data?.order?.province, { validators: Validators.required }),
      district: new FormControl<District | undefined>(this.data?.order?.district),
      ward: new FormControl<Ward | undefined>(this.data?.order?.ward),
      customerId: new FormControl<number | undefined>(this.data?.order?.customerId)
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onChangeCommodity(commodityIds: number[]) {
    this.formGroup.setControl('commodityIds', new FormControl(commodityIds));
  }

  onSubmit(): any {
    const val = this.formGroup.value;

    if (val.commodityIds.length == 0) {
      return this.message.warning('Chưa chọn hàng hoá');
    }

    const order = {
      customerId: val.customerId,
      commodityIds: val.commodityIds,
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
    if (this.data?.order && this.data?.isUpdate) {
      this.actions$.dispatch(
        OrderActions.update({
          id: this.data.order.id,
          updates: order
        })
      );
    } else {
      this.actions$.dispatch(OrderActions.addOne({ body: order }));
    }
    this.orderQuery.select().subscribe((state) => {
      if (!(state.loading && state.error)) {
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
