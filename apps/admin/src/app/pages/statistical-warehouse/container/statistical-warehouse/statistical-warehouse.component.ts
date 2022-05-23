import { Component, OnInit } from '@angular/core';
import { AdminAction } from '../../../../states/admin.action';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import {MenuAdminEnum} from "../../../../../enums/menu-admin.enum";

@Component({
  templateUrl: 'statistical-warehouse.component.html'
})
export class StatisticalWarehouseComponent implements OnInit {
  constructor(
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuAdminEnum.OVERVIEW_WAREHOUSE }));
  }
}
