import { Component, OnInit } from '@angular/core';
import { BillAction, BillQuery } from '../../state';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  templateUrl: 'bill.component.html'
})
export class BillComponent implements OnInit {
  bills$ = this.billQuery.selectAll();

  currencyUnit = CurrencyUnit;
  payType = PaymentType;

  constructor(
    private readonly actions$: Actions,
    private readonly billQuery: BillQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BillAction.loadAll({ take: 30, skip: 0 }));
  }

  onScroll() {
  }

  detailOrder() {
  }
}
