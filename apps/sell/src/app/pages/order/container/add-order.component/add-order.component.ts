import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommodityUnit, CustomerResource, CustomerType, PaymentType } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { OrderAction } from '../../+state/order.action';
import { PickCustomerComponent } from 'apps/sell/src/app/shared/components/pick-customer.component/pick-customer.component';
import { selectorCommodityByIds } from '../../../commodity/+state/commodity.selector';
import { selectorCurrentCustomer } from '../../../customer/+state/customer/customer.selector';
import { document } from 'ngx-bootstrap/utils';
import { Customer } from '../../../customer/+state/customer/customer.interface';
import { Commodity } from '../../../commodity/+state/commodity.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { PickCommodityComponent } from 'apps/sell/src/app/shared/components/pick-commodity/pick-commodity.component';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { selectedOrderAdded } from '../../+state/order.selector';


@Component({
  templateUrl: 'add-order.component.html'
})
export class AddOrderComponent implements OnInit {
  customerPicked$ = this.store.pipe(select(selectorCurrentCustomer(this.getCustomerId())));
  customers: Customer [] = [];
  commodityUnit = CommodityUnit;
  CommoditiesPicked: Commodity [] = [];
  numberChars = new RegExp('[^0-9]', 'g');
  customerPicked: Customer | undefined;
  customerId: number | undefined;
  commodityIds: number[] = [];
  payType = PaymentType;
  reload = new Subject<boolean>();
  formGroup!: FormGroup;
  customerType = CustomerType;
  resourceType = CustomerResource;
  submitted = false;
  wardId!: number;

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
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.customerPicked$.subscribe(val => {
      if (val) {
        this.customerPicked = JSON.parse(JSON.stringify(val));
      }
    });
    const btnOrder = document.getElementById('order');
    btnOrder?.classList.add('btn-border');
    document.getElementById('route').classList.remove('btn-border');
    document.getElementById('customer').classList.remove('btn-border');
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required],
      explain: ['']
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
        pickOne: true
      }
    });
    ref.afterClosed().subscribe(val => {
        if (val) {
          this.customerId = val;
          this.store.pipe(select(selectorCurrentCustomer(this.customerId))).subscribe(val => {
            this.customerPicked = JSON.parse(JSON.stringify(val));
          }).unsubscribe();
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

  get checkValid() {
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
      wardId: this.wardId,
      customerId: this.customerId,
      commodityIds: this.commodityIds
    };
    this.store.dispatch(OrderAction.addOrder({ order: order }));
    this.store.pipe(select(selectedOrderAdded)).subscribe(added => {
      if (added) {
        this.router.navigate(['/don-hang']).then();
      }
    });
    // this.observer.observe(document, { childList: true, subtree: true });
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }

}
