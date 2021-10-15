import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { OrgchartEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import {
  getAllPosition,
  PositionActions, selectPositionLoaded
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { getAllOrgchart, getOrgchartLoaded, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DialogBranchComponent } from '../../component/dialog-branch/dialog-branch.component';

@Component({
  templateUrl: 'branch.container.html'
})
export class BranchContainer implements OnInit {
  branches$ = this.store.pipe(select(getAllOrgchart));
  branchLoaded$ = this.store.pipe(select(getOrgchartLoaded));
  type = OrgchartEnum;
  pageSize = 30;
  pageIndexInit = 0;
  branch = new FormControl();

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
    this.branch.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
      this.store.dispatch(OrgchartActions.searchBranch({ branch: val }));
    });
  }

  addBranch() {
    this.dialog.open(DialogBranchComponent, { width: 'fit-content' });
  }

  updateBranch($event: any) {
    this.dialog.open(DialogBranchComponent,
      { width: 'fit-content', data: { branch: $event, isUpdate: true } });
  }

  deleteBranch($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrgchartActions.deleteBranch({ id: $event.id }));
      }
    });
  }


  addPosition() {

  }

  updatePosition($event: any) {

  }


  deletePosition($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(PositionActions.deletePosition({ id: $event.id }));
      }
    });
  }
}
