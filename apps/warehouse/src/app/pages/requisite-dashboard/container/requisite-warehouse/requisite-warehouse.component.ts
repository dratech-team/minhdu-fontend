import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllRequisite } from '../../+state/requisite.selector';
import { RequisiteAction } from '../../+state/requisite.action';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl:'requisite-warehouse.component.html',
})
export class RequisiteWarehouseComponent implements OnInit{
  requisites$ =  this.store.pipe(select(selectorAllRequisite))
  requisiteWarehouse = WarehouseTypeEnum.REQUISITE
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    document.getElementById('requisite')!.classList.add('btn-border')
    this.store.dispatch(RequisiteAction.loadInit({take:30, skip: 0}))
  }
  importRequisite() {

  }
}
