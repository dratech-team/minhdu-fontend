import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { PositionActions, selectPositionAdded } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getBranchAdded, OrgchartActions } from '@minhdu-fontend/orgchart';

@Component({
  templateUrl: 'dialog-branch.component.html'
})
export class DialogBranchComponent implements OnInit {
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    private readonly dialogRef: MatDialogRef<DialogBranchComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        branch: [this.data.branch.name]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        branch: [undefined, Validators.required]
      });
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit() {
    this.submitted = true;
    if (this.formGroup.valid) {
      const val = this.formGroup.value;
      if (this.data?.isUpdate) {
        this.store.dispatch(OrgchartActions.updateBranch(
          { id: this.data.branch.id, name: val.branch }));
      } else {
        this.store.dispatch(OrgchartActions.addBranch(
          { branch: { name: val.branch } }));
      }
    } else {
      return;
    }
    this.store.pipe(select(getBranchAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }
}
