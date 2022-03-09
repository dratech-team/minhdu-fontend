import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {CommodityUnit, CustomerResource, CustomerType, MenuEnum, PaymentType} from '@minhdu-fontend/enums';
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
import {CommodityEntity} from "../../../commodity/entities/commodity.entity";
import {CustomerActions} from "../../../customer/+state/customer.actions";

@Component({
  templateUrl: 'add-order.component.html'
})
export class AddOrderComponent implements OnInit {
  customerPicked$ = this.customerQuery.selectEntity(this.route.snapshot?.queryParams?.data)
  customers: CustomerEntity [] = [];
  commodityUnit = CommodityUnit;
  commoditiesPicked: CommodityEntity [] = [];
  numberChars = new RegExp('[^0-9]', 'g');
  customerPicked: CustomerEntity | undefined;
  customerId: number|undefined = this.route.snapshot.queryParams.data;
  payType = PaymentType;
  formGroup!: FormGroup;
  customerType = CustomerType;
  resourceType = CustomerResource;
  submitted = false;
  wardId?: number;
  provinceId!: number;

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(param => {
      if (param.data) {
       this.actions$.dispatch(CustomerActions.loadOne({id: param.data}))
      }
    });
    this.customerPicked$.subscribe(val => {
      this.customerPicked = val
    })

    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      endedAt: [],
      explain: ['']
    });
  }

  pickCustomer() {
    this.dialog.open(PickCustomerComponent, {
      width: '50%',
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
    this.customerId = undefined
    this.customerPicked = undefined;
  }

  pickCommodities() {
    this.dialog.open(PickCommodityComponent, {
      width: '65%',
      data: {
        pickMore: true,
        type: 'DIALOG',
        commoditiesPicked: this.commoditiesPicked
      }
    }).afterClosed().subscribe(val => {
        if (val) {
          this.commoditiesPicked = val;
        }
      }
    );
  }

  deleteCommodity(commodity: CommodityEntity) {
    const index = this.commoditiesPicked.findIndex(item => item.id === commodity.id);
    this.commoditiesPicked.splice(index, 1);
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
    const order: AddOrderDto = {
      createdAt: val.createdAt,
      endedAt: val.endedAt,
      explain: val.explain,
      wardId: this.wardId,
      provinceId: this.provinceId,
      customerId: this.customerId,
      commodityIds: this.commoditiesPicked.map(item => item.id)
    };
    this.actions$.dispatch(OrderActions.addOne(order));
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }
}
