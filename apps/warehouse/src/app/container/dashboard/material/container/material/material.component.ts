import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllAppliance } from '../../+state/material.selector';
import { MaterialAction } from '../../+state/material.action';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl:'material.component.html',
})
export class MaterialComponent implements OnInit{
  appliances$ = this.store.pipe(select(selectorAllAppliance))
  applianceWarehouse = WarehouseTypeEnum.APPLIANCE
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    document.getElementById('appliance')!.classList.add('btn-border')
    this.store.dispatch(MaterialAction.loadInit({take:30, skip: 0}))
  }

  importAppliance() {

  }
}
