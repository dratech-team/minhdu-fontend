import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../../customer/+state/customer/customer.action';
import { MatDialog } from '@angular/material/dialog';
import { OrderAction } from '../../+state/order.action';
import { PickCustomerComponent } from 'apps/sell/src/app/shared/components/pick-customer.component/pick-customer.component';
import { PickCommodityComponent } from 'apps/sell/src/app/shared/components/pick-commodity/pick-commodity.component';
import { selectAllCommodity } from '../../../commodity/+state/commodity.selector';
import { CommodityAction } from '../../../commodity/+state/commodity.action';
import { selectorAllCustomer } from '../../../customer/+state/customer/customer.selector';
import { document } from 'ngx-bootstrap/utils';


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
    const btnOrder = document.getElementById('order');
    btnOrder?.classList.add('btn-border');
    document.getElementById('route').classList.remove('btn-border')
    document.getElementById('customer').classList.remove('btn-border')
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required],
      explain: ['', Validators.required],
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
        width: '50%',
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
      customerId: this.customerId,
      commodityIds: this.commodityIds,
    };
    this.store.dispatch(OrderAction.addOrder({ order: order }));
  }
}
