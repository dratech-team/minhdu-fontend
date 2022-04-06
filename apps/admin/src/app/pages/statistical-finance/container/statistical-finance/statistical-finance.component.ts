import { Component, OnInit } from '@angular/core';
import { AdminAction } from '../../../../states/admin.action';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { FianceConstant } from '../../../../../../../../libs/constants/admin/fiance.constant';
import { FormControl } from '@angular/forms';
import { FinanceEnum } from '../../../../../../../../libs/enums/admin/finance.enum';

@Component({
  templateUrl: 'statistical-finance.component.html'
})
export class StatisticalFinanceComponent implements OnInit {
  fianceConstant = FianceConstant;
  financeEnum = FinanceEnum;
  selectFinance = new FormControl(FinanceEnum.COLLECT);

  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuWarehouseEum.OVERVIEW_FINANCE }));
  }
}
