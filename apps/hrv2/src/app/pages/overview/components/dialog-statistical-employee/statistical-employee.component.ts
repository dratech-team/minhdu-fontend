import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Actions } from '@datorama/akita-ng-effects';
import { BranchActions, BranchQuery } from '@minhdu-fontend/orgchart-v2';

@Component({
  templateUrl: 'statistical-employee.component.html',
})
export class StatisticalEmployeeComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  branches$ = this.branchQuery.selectAll();

  constructor(
    private readonly actions$: Actions,
    private readonly branchQuery: BranchQuery,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalRef: NzModalRef
  ) {}

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}));
    this.formGroup = this.formBuilder.group({
      rangeDay: [[], Validators.required],
      branch: ['', Validators.required],
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    } else {
      this.modalRef.close();
    }
  }
}
