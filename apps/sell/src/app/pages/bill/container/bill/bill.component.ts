import { Component, OnInit } from '@angular/core';
import { BillAction } from '../../+state/bill.action';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { BillQuery } from '../../+state/bill.query';
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  templateUrl: 'bill.component.html'
})
export class BillComponent implements OnInit {
  Bills$ = this.billQuery.selectAll();

  currencyUnit = CurrencyUnit;
  payType = PaymentType;

  constructor(
    private readonly actions$: Actions,
    private readonly billQuery: BillQuery,
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
