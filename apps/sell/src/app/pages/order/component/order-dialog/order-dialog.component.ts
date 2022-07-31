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
import { BaseOrderEntity } from '../../enitities';
import { BaseAddOrderDto, BaseUpdateOrderDto } from '../../dto';
import { omit } from 'lodash';
import { take } from 'rxjs/operators';
import { CustomerEntity } from '../../../customer/entities';

@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  @Input() data?: Partial<{
    order: BaseOrderEntity,
    tab: number,
    customerId?: number,
    isUpdate: boolean
  }>;

  formGroup!: FormGroup;
  districtId!: number;

  customer?: CustomerEntity;
  submitted = false;
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
    this.customer = this.customerQuery.getEntity(this.data?.customerId);

    this.formGroup = new FormGroup({
      createdAt: new FormControl(
        this.datePipe.transform(this.data?.order?.createdAt || new Date(), 'yyyy-MM-dd'),
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
      customerId: new FormControl<number | undefined>(this.data?.customerId),
      commodityIds: new FormControl<number[] | undefined>(this.data?.order?.commodities?.map(commodity => commodity.id))
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onChangeCommodity(commodityIds: number[]) {
    this.formGroup.setControl('commodityIds', new FormControl(commodityIds));
  }

  onSubmit(): any {
    if (this.formGroup.value.commodityIds.length == 0) {
      return this.message.warning('Chưa chọn hàng hoá');
    }

    if (this.data?.order && this.data?.isUpdate) {
      this.actions$.dispatch(
        OrderActions.update({
          id: this.data.order.id,
          updates: this.mapToOrder(this.formGroup.value)
        })
      );
    } else {
      this.actions$.dispatch(OrderActions.addOne({
        body: this.mapToOrder(this.formGroup.value)
      }));
    }
    this.orderQuery.select().pipe(take(1)).subscribe((state) => {
      if (!(state.loading && state.error)) {
        this.modalRef.close();
      }
    });
  }

  pre(): void {
    if (this.data?.customerId) {
      this.stepIndex = 0;
    } else {
      this.stepIndex -= 1;
    }
  }

  next(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    if (this.stepIndex > 0 && !this.formGroup.value.customerId) {
      return this.message.warning('Chưa chọn khách hàng');
    }
    if (this.data?.customerId) {
      this.stepIndex = 2;
    } else {
      this.stepIndex += 1;
    }
  }

  private mapToOrder(val: any): BaseAddOrderDto | BaseUpdateOrderDto {
    if (!val.deliveredAt) {
      val = omit(val, 'deliveredAt');
    }
    if (!val.districtId) {
      val = omit(val, 'districtId');
    }
    if (!val.wardId) {
      val = omit(val, 'wardId');
    }
    return {
      ...val,
      wardId: val?.ward?.id,
      districtId: val?.district?.id,
      provinceId: val.province.id
    };
  }
}
