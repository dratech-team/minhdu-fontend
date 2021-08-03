import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllMaterial } from '../../+state/material.selector';
import { MaterialAction } from '../../+state/material.action';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector:'app-material',
  templateUrl:'material.component.html',
})
export class MaterialComponent implements OnInit{
  material$ = this.store.pipe(select(selectorAllMaterial))
  applianceWarehouse = WarehouseTypeEnum.MATERIAL
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
    }
  );
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    this.store.dispatch(MaterialAction.loadInit({take:30, skip: 0}))
  }

  importAppliance() {

  }

  importMaterial() {

  }
}
