import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { OrgchartEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { getAllOrgchart, getOrgchartLoaded, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DialogBranchComponent } from '../../component/dialog-branch/dialog-branch.component';
import { Router } from '@angular/router';
import { PageTypeEnum } from 'libs/enums/sell/page-type.enum';

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
  pageType = PageTypeEnum;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
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

  detailBranch($event: any) {
    this.router.navigate(['to-chuc/chi-tiet-don-vi/', $event.id]).then();
  }

  deleteBranch($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrgchartActions.deleteBranch({ id: $event.id }));
      }
    });
  }

  onEmployee(event: any){
    this.router.navigate(['ho-so'], {
      queryParams:{
        branch: event.name
      }
    }).then()
  }
}
