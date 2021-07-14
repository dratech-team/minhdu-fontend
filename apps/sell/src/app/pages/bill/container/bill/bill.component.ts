import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllBills } from '../../+state/bill.selector';
import { BillAction } from '../../+state/bill.action';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';

@Component({
  templateUrl:'bill.component.html'
})
export class BillComponent implements OnInit{
  Bills$ = this.store.pipe(select(selectorAllBills))
  currencyUnit = CurrencyUnit;
  payType = PaymentType;
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    this.store.dispatch(BillAction.loadInit({take:30, skip:0}))
  }
  onScroll(){

  }
  detailOrder(){

  }
}
