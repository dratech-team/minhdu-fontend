import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommodityUnit, CustomerResource, CustomerType, MenuEnum, PaymentType } from '@minhdu-fontend/enums';
import { OrderAction } from '../../+state/order.action';
import { MainAction } from '../../../../states/main.action';
import { Commodity } from '../../../commodity/entities/commodity.entity';
import { Customer } from '../../../customer/+state/customer.interface';
import { DatePipe } from '@angular/common';
import { CommodityQuery } from '../../../commodity/+state/commodity.query';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerQuery } from '../../../customer/+state/customer.query';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { PickCustomerComponent } from '../../../../shared/components/pick-customer.component/pick-customer.component';
import { PickCommodityComponent } from '../../../../shared/components/pick-commodity/pick-commodity.component';

@Component({
  templateUrl: 'add-order.component.html'
})
export class AddOrderComponent implements OnInit {
  customerPicked$ = this.customerQuery.selectEntity(this.route.snapshot.params.id);
  commoditiesPicked: Commodity[] = [];

  customers: Customer[] = [];
  commodityUnit = CommodityUnit;
  numberChars = new RegExp('[^0-9]', 'g');
  customerPicked: Customer | undefined;
  submitted = false;
  wardId?: number;
  provinceId!: number;

  payType = PaymentType;
  customerType = CustomerType;
  resourceType = CustomerResource;
  formGroup: FormGroup = this.formBuilder.group({
    createdAt: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
    endedAt: [],
    explain: ['']
  });

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly commodityQuery: CommodityQuery
  ) {
  }

  ngOnInit() {
    console.log('===', this.commoditiesPicked);
    this.actions$.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.ORDER }));
    this.customerPicked$.subscribe((val: any) => {
      if (val) {
        this.customerPicked = JSON.parse(JSON.stringify(val));
      }
    });
  }

  pickCustomer() {
    this.dialog.open(PickCustomerComponent, {
      width: '70%',
      data: {
        pickOne: true
      }
    }).afterClosed().subscribe(val => {
        if (val) {
          this.route.snapshot.params.id = val;
          this.customerPicked = this.customerQuery.getEntity(this.route.snapshot.params.id);
        }
      }
    );
  }

  deleteCustomerId() {
    // this.customerId = undefined;
    // this.customerPicked = undefined;
  }

  pickCommodities() {
    this.dialog.open(PickCommodityComponent, {
      width: '65%',
      data: {
        pickMore: true,
        type: 'DIALOG',
        ids: this.commoditiesPicked.map(commodity => commodity.id)
      }
    }).afterClosed().subscribe((commodityIds) => {
      if (commodityIds) {
        this.commoditiesPicked = commodityIds.map((commodityId: number[]) => this.commodityQuery.getEntity(commodityId));
      }
    });
  }

  unSelect(commodity: Commodity) {
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
    if (this.wardId) {
      const order: CreateOrderDto = {
        customerId: this.route.snapshot.params.id,
        createdAt: val.createdAt,
        endedAt: val.endedAt,
        explain: val.explain,
        wardId: this.wardId,
        provinceId: this.provinceId,
        commodityIds: this.commoditiesPicked.map(commodity => commodity.id)
      };
      this.actions$.dispatch(OrderAction.addOne(order));
    }
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }
}
