import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllRequisite } from '../../+state/requisite.selector';
import { RequisiteAction } from '../../+state/requisite.action';

@Component({
  templateUrl:'requisite-warehouse.component.html',
})
export class RequisiteWarehouseComponent implements OnInit{
  requisites$ =  this.store.pipe(select(selectorAllRequisite))
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    this.store.dispatch(RequisiteAction.loadInit({take:30, skip: 0}))
  }
  importRequisite() {

  }
}
