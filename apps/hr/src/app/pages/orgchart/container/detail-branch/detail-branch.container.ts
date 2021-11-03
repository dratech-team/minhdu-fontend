import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { OrgchartEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { getBranchById, getOrgchartLoaded, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DialogBranchComponent } from '../../component/dialog-branch/dialog-branch.component';
import { AllowanceBranchComponent } from '../../component/dialog-allowance-branch/allowance-branch.component';
import { ActivatedRoute } from '@angular/router';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';

@Component({
  templateUrl: 'detail-branch.container.html'
})
export class DetailBranchContainer implements OnInit {
  branch$ = this.store.pipe(select(getBranchById(this.branchId)));
  branchLoaded$ = this.store.pipe(select(getOrgchartLoaded));
  type = OrgchartEnum;
  pageSize = 30;
  pageIndexInit = 0;
  branch = new FormControl();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.getBranch({ id: this.branchId }));
    this.branch.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
      this.store.dispatch(OrgchartActions.searchBranch({ branch: val }));
    });
  }

  addAllowanceBranch(branchId: number) {
    this.dialog.open(AllowanceBranchComponent, { width: 'fit-content', data: { branchId: branchId } });
  }

  updateAllowanceBranch(allowance: any, branchId: number) {
    this.dialog.open(AllowanceBranchComponent,
      {
        width: 'fit-content',
        data: {
          isUpdate: true,
          allowance: allowance,
          branchId: branchId
        }
      });
  }

  updateBranch($event: any) {
    this.dialog.open(DialogBranchComponent,
      { width: 'fit-content', data: { branch: $event, isUpdate: true } });
  }

  get branchId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  deleteBranch($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrgchartActions.deleteBranch({ id: $event.id }));
      }
    });
  }

  deleteAllowance(allowanceId: number, branchId: number) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(PayrollAction.deleteSalary({ id: allowanceId, branchId: branchId }));
      }
    });
  }
}
