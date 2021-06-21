import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { OrgchartActions } from '@minhdu-fontend/orgchart';

@Component({
  templateUrl: 'orgchart.container.html',
})
export class OrgchartContainer implements OnInit {
  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
  }

  onAdd(): void {
    this.store.dispatch(
      OrgchartActions.addDepartment({
        name: 'Position 1',
        branchId: 1,
      })
    );
  }
}
