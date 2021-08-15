import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllOrders } from '../../+state/order.selector';
import { OrderAction } from '../../+state/order.action';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PaidType } from 'libs/enums/paidType.enum';
import { document } from 'ngx-bootstrap/utils';


@Component({
  templateUrl: 'order.component.html'

})
export class OrderComponent implements OnInit {
  paidType = PaidType;
  currencyUnit = CurrencyUnit;
  payType = PaymentType;
  pageIndex: number = 1;
  pageSize: number = 30;
  orders$ = this.store.pipe(select(selectorAllOrders));
  formGroup = new FormGroup(
    {
      paidType: new FormControl(''),
      name: new FormControl(''),
    }
  );

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,

  ) {
  }

  ngOnInit() {
    document.getElementById('order').classList.add('btn-border')
    document.getElementById('route').classList.remove('btn-border')
    document.getElementById('customer').classList.remove('btn-border')
    this.store.dispatch(OrderAction.loadInit({ take: 30, skip: 0 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
          this.store.dispatch(OrderAction.loadInit(this.order(val,30, 0)));
        }
      )
    ).subscribe();
  }

  add() {
    this.router.navigate(['don-hang/them-don-hang']).then();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(OrderAction.loadMoreOrders(this.order(val,this.pageSize, this.pageIndex)));
  }

  order(val: any, pageSize: number, pageIndex: number) {
    return {
      skip: pageSize * pageIndex++,
      take: pageSize,
      paidType: val.paidType,
      customer: val.name.trim()
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }
}
