import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {getAllOrgchart, OrgchartActions} from '@minhdu-fontend/orgchart';
import {startWith} from 'rxjs/operators';
import {Branch} from '@minhdu-fontend/data-models';
import {searchAutocomplete} from '@minhdu-fontend/utils';
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {BranchActions, BranchQuery} from "@minhdu-fontend/orgchart-v2";

@Component({
  templateUrl: 'statistical-employee.component.html'
})
export class StatisticalEmployeeComponent implements OnInit {
  formGroup!: FormGroup;
  branches$ = this.branchQuery.selectAll();

  constructor(
    private readonly actions$: Actions,
    private readonly branchQuery: BranchQuery,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}));
    this.formGroup = this.formBuilder.group({
        rangeDay: [[], Validators.required],
        branch: ['', Validators.required]
      }
    );
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return
    } else {
      this.modalRef.close()
    }
  }
}
