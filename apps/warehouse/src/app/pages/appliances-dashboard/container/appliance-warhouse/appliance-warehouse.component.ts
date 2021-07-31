import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllAppliance } from '../../+state/appliance.selector';
import { ApplianceAction } from '../../+state/appliance.action';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl:'appliance-warehouse.component.html',
})
export class ApplianceWarehouseComponent implements OnInit{
  appliances$ = this.store.pipe(select(selectorAllAppliance))
  applianceWarehouse = WarehouseTypeEnum.APPLIANCE
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    document.getElementById('appliance')!.classList.add('btn-border')
    this.store.dispatch(ApplianceAction.loadInit({take:30, skip: 0}))
  }

  importAppliance() {

  }
}
