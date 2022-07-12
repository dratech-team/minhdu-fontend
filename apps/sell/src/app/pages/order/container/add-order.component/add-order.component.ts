import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommodityUnit, CustomerResource, CustomerType, PaymentType } from '@minhdu-fontend/enums';
import { OrderActions, OrderQuery } from '../../+state';
import { CustomerEntity } from '../../../customer/entities';
import { DatePipe } from '@angular/common';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerActions, CustomerQuery } from '../../../customer/+state';
import { CommodityEntity } from '../../../commodity/entities';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SelectCommodityComponent, SelectCustomerComponent } from '../../../../shared/components';

@Component({
  templateUrl: 'add-order.component.html'
})
export class AddOrderComponent implements OnInit {
  commodityUnit = CommodityUnit;
  commoditiesPicked: CommodityEntity[] = [];
  numberChars = new RegExp('[^0-9]', 'g');
  customerPicked: CustomerEntity | undefined;
  customerId: number = this.route.snapshot.queryParams.customerid;
  payType = PaymentType;
  formGroup!: UntypedFormGroup;
  customerType = CustomerType;
  resourceType = CustomerResource;
  submitted = false;

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly orderQuery: OrderQuery,
    private readonly snackbar: MatSnackBar,
    private readonly modal: NzModalService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param) => {
      if (param.customerId) {
        this.actions$.dispatch(
          CustomerActions.loadOne({ id: param.customerId })
        );
        this.customerQuery.selectEntity(param.customerId).subscribe((val) => {
          this.customerPicked = val;
        });
      }
    });

    this.formGroup = this.formBuilder.group({
      createdAt: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required
      ],
      endedAt: [],
      explain: [''],
      province: ['', Validators.required],
      district: [],
      ward: []
    });
  }

  pickCustomer() {
    this.dialog
      .open(SelectCustomerComponent, {
        width: '70vw',
        data: {
          pickOne: true,
          customerInit: this.customerPicked
        }
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.customerId = val;
          this.customerQuery.selectEntity(this.customerId).subscribe((val) => {
            this.customerPicked = val;
          });
        }
      });
  }

  pickCommodities() {
    this.modal.create({
      nzTitle: 'Chon đơn hàng',
      nzContent: SelectCommodityComponent,
      nzWidth: '70vw',
      nzComponentParams: { commodities: this.commoditiesPicked },
      nzFooter: null
    }).afterClose.subscribe((val) => {
      if (val) {
        this.commoditiesPicked = val;
      }
    });
  }

  deleteCommodity(commodity: CommodityEntity) {
    const index = this.commoditiesPicked.findIndex(
      (item) => item.id === commodity.id
    );
    this.commoditiesPicked.splice(index, 1);
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (!this.customerId) {
      return this.snackbar.open('Khách hàng không được để trống');
    }
    if (this.commoditiesPicked.length === 0) {
      return this.snackbar.open('Vui lòng chọn hàng hóa');
    }

    const val = this.formGroup.value;
    const order = {
      createdAt: val.createdAt,
      endedAt: val.endedAt,
      explain: val.explain,
      wardId: val?.ward?.id,
      districtId: val?.district?.id,
      provinceId: val.province.id,
      customerId: this.customerId,
      commodityIds: this.commoditiesPicked.map((item) => item.id)
    };
    this.actions$.dispatch(OrderActions.addOne({ body: order }));
  }
}
