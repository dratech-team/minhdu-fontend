import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getAllOrgchart, getOrgchartLoaded, OrgchartActions } from '@minhdu-fontend/orgchart';
import { Branch } from '@minhdu-fontend/data-models';
import { MatDialog } from '@angular/material/dialog';
import { DialogBranchComponent } from '../components/dialog-branch/dialog-branch.component';
import { DialogSharedComponent } from '../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  templateUrl: 'branch.component.html'
})
export class BranchComponent implements OnInit {
  branches$ = this.store.pipe(select(getAllOrgchart));
  formGroup = new FormGroup({
    search: new FormControl(),
    status: new FormControl(-1)
  });
  loaded$ = this.store.select(getOrgchartLoaded);

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(val => {
      this.store.dispatch(OrgchartActions.searchBranch({ search: val?.search, status: val?.status }));
    });
  }

  onAdd() {
    this.dialog.open(DialogBranchComponent, {
      width: 'fit-content'
    });
  }

  onUpdate(branch: Branch) {
    this.dialog.open(DialogBranchComponent, {
      width: 'fit-content',
      data: {
        branch: branch,
        isUpdate: true
      }
    });
  }

  onRemove(branch: Branch) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá Chi nhánh',
        description: `bạn có muốn xoá chi nhánh ${branch.name}`
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.store.dispatch(OrgchartActions.deleteBranch({ id: branch.id }));
        }
      });
  }
}
