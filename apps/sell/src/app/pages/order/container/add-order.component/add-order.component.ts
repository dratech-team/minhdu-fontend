import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommodityUnit, CustomerResource, CustomerType, PaymentType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../../customer/+state/customer/customer.action';
import { MatDialog } from '@angular/material/dialog';
import { OrderAction } from '../../+state/order.action';
import { PickCustomerComponent } from 'apps/sell/src/app/shared/components/pick-customer.component/pick-customer.component';
import { selectAllCommodity, selectorCommodityByIds } from '../../../commodity/+state/commodity.selector';
import { CommodityAction } from '../../../commodity/+state/commodity.action';
import { selectorAllCustomer, selectorCurrentCustomer } from '../../../customer/+state/customer/customer.selector';
import { document } from 'ngx-bootstrap/utils';
import { Customer } from '../../../customer/+state/customer/customer.interface';
import { Commodity } from '../../../commodity/+state/commodity.interface';
import { ActivatedRoute } from '@angular/router';
import { PickCommodityComponent } from 'apps/sell/src/app/shared/components/pick-commodity/pick-commodity.component';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';


@Component({
  templateUrl: 'add-order.component.html'
})
export class AddOrderComponent implements OnInit {
  commodities$ = this.store.pipe(select(selectAllCommodity));
  customers$ = this.store.pipe(select(selectorAllCustomer));
  customerPicked$ = this.store.pipe(select(selectorCurrentCustomer(this.getCustomerId())));
  customers: Customer [] = [];
  customerPicked: Customer | undefined;
  commodityUnit = CommodityUnit;
  Commodities: Commodity [] = [];
  CommoditiesPicked: Commodity [] = [];
  numberChars = new RegExp('[^0-9]', 'g');
  customerId: number | undefined;
  commodityIds: number[] = [];
  payType = PaymentType;
  reload = new Subject<boolean>();
  formGroup!: FormGroup;
  customerType = CustomerType;
  resourceType = CustomerResource;
  submitted = false;

  observer = new MutationObserver((mutations) => {
    if (document.contains(document.getElementById('success'))) {
      this.customerId = undefined;
      this.customerPicked = undefined;
      this.commodityIds = [];
      this.store.pipe(select(selectorCommodityByIds(this.commodityIds))).subscribe(val => {
        this.CommoditiesPicked = JSON.parse(JSON.stringify(val));
      });
    }
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly snackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }));
    this.store.dispatch(CommodityAction.loadAllCommodities());
    this.customerPicked$.subscribe(val => {
      if (val) {
        this.customerPicked = JSON.parse(JSON.stringify(val));
      }
    });
    this.customers$.subscribe(val => this.customers = JSON.parse(JSON.stringify(val)));
    this.commodities$.subscribe(val => this.Commodities = JSON.parse(JSON.stringify(val)));
    const btnOrder = document.getElementById('order');
    btnOrder?.classList.add('btn-border');
    document.getElementById('route').classList.remove('btn-border');
    document.getElementById('customer').classList.remove('btn-border');
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required],
      explain: [''],
      ward: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required]
    });

  }

  getCustomerId() {
    this.route.queryParams.subscribe(param => {
      if (param.data) {
        this.customerId = JSON.parse(param.data);
      }
    });
    return this.customerId;
  }

  pickCustomer() {
    const ref = this.dialog.open(PickCustomerComponent, {
      width: '50%',
      data: {
        customers$: this.customers$,
        pickOne: true
      }
    });
    ref.afterClosed().subscribe(val => {
        if (val) {
          this.customerId = val;
          this.store.pipe(select(selectorCurrentCustomer(this.customerId))).subscribe(val => {
            this.customerPicked = JSON.parse(JSON.stringify(val));
          });
        }
      }
    );
  }

  deleteCustomerId() {
    this.customerId = undefined;
    this.customerPicked = undefined;
  }

  pickCommodities() {
    const ref = this.dialog.open(PickCommodityComponent, {
      width: '65%',
      data: {
        commodities$: this.commodities$,
        pickMore: true,
        type: 'DIALOG'
      }
    });
    ref.afterClosed().subscribe(val => {
        if (val) {
          this.commodityIds = val;
          this.store.pipe(select(selectorCommodityByIds(this.commodityIds))).subscribe(val => {
            this.CommoditiesPicked = JSON.parse(JSON.stringify(val));
          });
        }
      }
    );
  }

  deleteCommodityId(commodityId: number) {
    this.commodityIds.forEach((element, index) => {
      if (element === commodityId) this.commodityIds.splice(index, 1);
    });
    this.store.pipe(select(selectorCommodityByIds(this.commodityIds))).subscribe(val => {
      this.CommoditiesPicked = JSON.parse(JSON.stringify(val));
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (!this.customerId) {
      this.snackbar.openFromComponent(SnackBarComponent, {
        data: { content: 'Chưa chọn khách hàng' },
        panelClass: ['background-snackbar-validate'],
        duration: 2500
      });
      return;
    }
    const val = this.formGroup.value;
    const order = {
      createdAt: val.createdAt,
      explain: val.explain,
      wardId: val.ward,
      customerId: this.customerId,
      commodityIds: this.commodityIds
    };
    this.store.dispatch(OrderAction.addOrder({ order: order }));
    this.observer.observe(document, { childList: true, subtree: true });
  }
}
