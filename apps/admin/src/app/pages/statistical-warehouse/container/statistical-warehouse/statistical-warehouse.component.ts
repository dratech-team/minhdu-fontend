import { Component, OnInit } from '@angular/core';
import { AdminAction } from '../../../../states/admin.action';
import { MenuEnum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';

@Component({
  templateUrl: 'statistical-warehouse.component.html'
})
export class StatisticalWarehouseComponent implements OnInit {
  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuEnum.OVERVIEW_WAREHOUSE }));
  }
}
