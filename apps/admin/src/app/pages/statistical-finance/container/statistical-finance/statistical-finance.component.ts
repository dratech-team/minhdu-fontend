import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FianceConstant } from '../../../../../../../../libs/constants/admin/fiance.constant';
import { UntypedFormControl } from '@angular/forms';
import { FinanceEnum } from '../../../../../../../../libs/enums/admin/finance.enum';

@Component({
  templateUrl: 'statistical-finance.component.html'
})
export class StatisticalFinanceComponent implements OnInit {
  fianceConstant = FianceConstant;
  financeEnum = FinanceEnum;
  selectFinance = new UntypedFormControl(FinanceEnum.COLLECT);

  constructor(private readonly store: Store) {
  }

  ngOnInit() {
  }
}
