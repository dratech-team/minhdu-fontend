import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllAppliance } from '../../+state/appliance.selector';
import { ApplianceAction } from '../../+state/appliance.action';

@Component({
  selector:'app-appliance-dashboard',
  templateUrl:'appliance.component.html',
})
export class ApplianceComponent implements OnInit{
  appliances$ = this.store.pipe(select(selectorAllAppliance))
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    this.store.dispatch(ApplianceAction.loadInit({take:30, skip: 0}))
  }

  importAppliance() {

  }
}
