import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {getAllOrgchart, OrgchartActions} from "@minhdu-fontend/orgchart";
import {Branch} from "@minhdu-fontend/data-models";
import {MatDialog} from "@angular/material/dialog";
import {DialogBranchComponent} from "../components/dialog-branch/dialog-branch.component";
import {
  DialogSharedComponent
} from "../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";

@Component({
  templateUrl: 'branch.component.html'
})
export class BranchComponent implements OnInit {
  branches$ = this.store.pipe(select(getAllOrgchart));
  formGroup = new FormGroup({
    search: new FormControl(),
    status: new FormControl(-1),
  })

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
  }

  addBranch() {
    this.dialog.open(DialogBranchComponent, {
      width: 'fit-content',
    })
  }

  updateBranch(branch: Branch) {
    this.dialog.open(DialogBranchComponent, {
      width: 'fit-content',
      data: {
        branch: branch,
        isUpdate: true
      }
    })
  }

  deleteBranch(branch: Branch) {
    this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá Chi nhánh',
        description: `bạn có muốn xoá chi nhánh ${branch.name}`
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.store.dispatch(OrgchartActions.deleteBranch({id: branch.id}))
        }
      })
  }
}
