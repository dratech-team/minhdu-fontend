import { Component, OnInit } from '@angular/core';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AdminAction } from 'apps/admin/src/app/states/admin.action';
import { MenuAdminEnum } from '../../../../../enums/menu-admin.enum';

@Component({
  templateUrl: 'statistical-personnel.component.html',
})
export class StatisticalPersonnelComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(
      AdminAction.updateStateMenu({ tab: MenuAdminEnum.OVERVIEW_PERSONNEL })
    );
  }
}
