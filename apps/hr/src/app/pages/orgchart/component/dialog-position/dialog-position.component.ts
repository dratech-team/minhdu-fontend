import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { PositionActions, selectPositionAdded } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { Branch } from '@minhdu-fontend/data-models';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { searchAndAddAutocomplete, searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { startWith } from 'rxjs/operators';

@Component({
  templateUrl: 'dialog-position.component.html'
})
export class DialogPositionComponent implements OnInit {
  formGroup!: FormGroup;
  submitted = false;
  branchId!: number
  branches = new FormControl();
  branches$ = this.store.pipe(select(getAllOrgchart));
  constructor(
    private readonly dialogRef: MatDialogRef<DialogPositionComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    if (this.data?.isUpdate) {
      this.branchId = this.data.position.branchId
      this.formGroup = this.formBuilder.group({
        position: [this.data.position.name],
        workday: [this.data.position.workday],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        position: [undefined, Validators.required],
        workday: [undefined, Validators.required],
      });
    }
    this.branches$ = searchAutocomplete(
      this.branches.valueChanges.pipe(startWith(this.data?.branch?.name || '')),
      this.branches$
    );
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit() {
    this.submitted = true;
    if (this.formGroup.valid) {
      const val = this.formGroup.value;
      if (this.data?.isUpdate) {
        this.store.dispatch(PositionActions.updatePosition(
          {
            id: this.data.position.id,
            name: val.position,
            workday: val.workday,
            branchId: this.branchId
          }));
      } else {
        this.store.dispatch(PositionActions.addPosition({
          name: val.position,
          workday: val.workday,
          branchId: this.data?.branchId ? this.data.branchId : this.branchId
        }));
      }

    } else {
      return;
    }
    this.store.pipe(select(selectPositionAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  selectBranch(branch: Branch) {
      this.branchId = branch.id;
  }
}
