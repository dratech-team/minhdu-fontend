import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../../customer/+state/customer.action';
import { MatDialog } from '@angular/material/dialog';
import { OrderAction } from '../../+state/order.action';
import { PickCustomerComponent } from 'apps/sell/src/app/shared/components/pick-customer.component/pick-customer.component';
import { PickCommodityComponent } from 'apps/sell/src/app/shared/components/pick-commodity/pick-commodity.component';
import { selectAllCommodity } from '../../../commodity/+state/commodity.selector';
import { CommodityAction } from '../../../commodity/+state/commodity.action';
import { selectorAllCustomer } from '../../../customer/+state/customer.selector';


@Component({
  templateUrl: 'add-order.component.html'
})
export class AddOrderComponent implements OnInit {
  commodities$ = this.store.pipe(select(selectAllCommodity));
  customers$ = this.store.pipe(select(selectorAllCustomer));
  numberChars = new RegExp('[^0-9]', 'g');
  customerId!: number;
  commodityIds: number[] = [];
  payType = PaymentType;
  formGroup!: FormGroup;

  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required],
      explain: ['', Validators.required],
      payType: ['', Validators.required],
      paidTotal: ['', Validators.required],
      paidAt: ['', Validators.required],
      ward: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      nation: ['', Validators.required]
    });
  }


  pickCustomers() {
    this.store.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }));
    const dialogRef = this.dialog.open(PickCustomerComponent,
      {
        width: '40%',
        data: { pickOne: true, customers$: this.customers$ }
      });
    dialogRef.afterClosed().subscribe(val => this.customerId = val);
  }

  pickCommodities() {
    this.store.dispatch(CommodityAction.loadInit({ take: 30, skip: 0 }));
    const dialogRef = this.dialog.open(PickCommodityComponent, {
      width: '70%',
      data: {
        type: 'DIALOG',
        commodities$: this.commodities$
      }
    });
    dialogRef.afterClosed().subscribe(val => this.commodityIds = val);
  }

  onSubmit() {
    const val = this.formGroup.value;
    const order = {
      createdAt: val.createdAt,
      explain: val.explain,
      destinationId: val.ward,
      payType: val.payType ? val.payType : undefined,
      paidTotal: typeof (val.paidTotal) === 'string' ? Number(val.paidTotal.replace(this.numberChars, '')) : val.paidTotal,
      paidAt: val.paidAt,
      customerId: this.customerId,
      commodityIds: this.commodityIds,
    };
    this.store.dispatch(OrderAction.addOrder({ order: order }));
  }
}
