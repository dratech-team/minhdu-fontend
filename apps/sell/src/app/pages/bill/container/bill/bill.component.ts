import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { BillAction } from '../../+state/bill.action';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Actions } from '@datorama/akita-ng-effects';
import { BillQuery } from '../../+state/bill.query';

@Component({
  templateUrl: 'bill.component.html'
})
export class BillComponent implements OnInit {
  Bills$ = this.billQuery.selectAll();

  currencyUnit = CurrencyUnit;
  payType = PaymentType;

  constructor(
    private readonly action$: Actions,
    private readonly billQuery: BillQuery
  ) {
  }

  ngOnInit() {
    this.action$.dispatch(BillAction.loadInit({ take: 30, skip: 0 }));
  }

  onScroll() {
  }

  detailOrder() {
  }
}
