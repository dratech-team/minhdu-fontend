import { Component, OnInit } from '@angular/core';
import { MenuEnum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AdminAction } from 'apps/admin/src/app/states/admin.action';

@Component({
  templateUrl: 'statistical-personnel.component.html'
})
export class StatisticalPersonnelComponent implements OnInit {
  constructor(
    private readonly store: Store,
  ) {}

  ngOnInit() {
    this.store.dispatch(AdminAction.updateStateMenu({ tab: MenuEnum.OVERVIEW_PERSONNEL }));
  }
}
