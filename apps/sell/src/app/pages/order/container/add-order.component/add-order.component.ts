import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {CommodityUnit, CustomerResource, CustomerType, PaymentType} from '@minhdu-fontend/enums';
import {PickCommodityComponent} from 'apps/sell/src/app/shared/components/pick-commodity/pick-commodity.component';
import {
  PickCustomerComponent
} from 'apps/sell/src/app/shared/components/pick-customer.component/pick-customer.component';
import {OrderActions} from '../../+state/order.actions';
import {CustomerEntity} from '../../../customer/entities/customer.entity';
import {DatePipe} from '@angular/common';
import {Actions} from '@datorama/akita-ng-effects';
import {CustomerQuery} from '../../../customer/+state/customer.query';
import {AddOrderDto} from '../../dto/add-order.dto';
import {CommodityEntity} from "../../../commodity/entities/commodities/commodity.entity";
import {CustomerActions} from "../../../customer/+state/customer.actions";
import {OrderQuery} from "../../+state/order.query";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'add-order.component.html'
})
export class AddOrderComponent implements OnInit {
  customers: CustomerEntity [] = [];
  commodityUnit = CommodityUnit;
  commoditiesPicked: CommodityEntity [] = [];
  numberChars = new RegExp('[^0-9]', 'g');
  customerPicked: CustomerEntity | undefined;
  customerId: number = this.route.snapshot.queryParams.customerid;
  payType = PaymentType;
  formGroup!: FormGroup;
  customerType = CustomerType;
  resourceType = CustomerResource;
  submitted = false;

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly formBuilder: FormBuilder,
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
    this.route.queryParams.subscribe(param => {
      if (param.customerId) {
        this.actions$.dispatch(CustomerActions.loadOne({id: param.customerId}))
        this.customerQuery.selectEntity(param.customerId).subscribe(val => {
          this.customerPicked = val
        })
      }
    });

    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      endedAt: [],
      explain: [''],
      province: ['', Validators.required],
      district: [],
      ward: [],
    });
  }

  pickCustomer() {
    this.dialog.open(PickCustomerComponent, {
      width: '70vw',
      data: {
        pickOne: true,
        customerInit: this.customerPicked
      }
    }).afterClosed().subscribe(val => {
        if (val) {
          this.customerId = val;
          this.customerQuery.selectEntity(this.customerId).subscribe(val => {
            this.customerPicked = val
          });
        }
      }
    );
  }

  deleteCustomerId() {
    this.customerPicked = undefined;
  }

  pickCommodities() {
    this.modal.create({
      nzTitle:'Chon đơn hàng',
      nzContent: PickCommodityComponent,
      nzWidth: '70vw',
      nzComponentParams: {
        data: {
          pickMore: true,
          type: 'DIALOG',
          commoditiesPicked: this.commoditiesPicked,
        }
      },
      nzFooter: null
    }).afterClose.subscribe(val => {
      if (val) {
        this.commoditiesPicked = val;
      }
    })
  }

  deleteCommodity(commodity: CommodityEntity) {
    const index = this.commoditiesPicked.findIndex(item => item.id === commodity.id);
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
    const order: AddOrderDto = {
      createdAt: val.createdAt,
      endedAt: val.endedAt,
      explain: val.explain,
      wardId: val?.ward?.id,
      districtId: val?.district?.id,
      provinceId: val.province.id,
      customerId: this.customerId,
      commodityIds: this.commoditiesPicked.map(item => item.id)
    };
    this.actions$.dispatch(OrderActions.addOne(order));
  }
}
