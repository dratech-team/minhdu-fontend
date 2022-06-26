import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getAllPosition, PositionActions } from '@minhdu-fontend/orgchart-position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { AppState } from '../../../../reducers';

@Component({
  templateUrl: 'rank.component.html'
})
export class RankComponent implements OnInit {
  formGroup = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    gender: new UntypedFormControl(''),
    position: new UntypedFormControl(''),
    branch: new UntypedFormControl('')
  });
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));

  constructor(
    private readonly store: Store<AppState>
  ) {

  }

  ngOnInit() {
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')?.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')?.patchValue(branchName);
  }
}
