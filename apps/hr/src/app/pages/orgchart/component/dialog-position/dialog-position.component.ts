import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { PositionActions, selectPositionAdded } from '../../../../../../../../libs/orgchart/src/lib/+state/position';

@Component({
  templateUrl: 'dialog-position.component.html'
})
export class DialogPositionComponent implements OnInit {
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    private readonly dialogRef: MatDialogRef<DialogPositionComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        position: [this.data.position.name],
        workday: [this.data.position.workday]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        position: [undefined, Validators.required],
        workday: [undefined, Validators.required]
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
        this.store.dispatch(PositionActions.updatePosition(
          {
            id: this.data.position.id,
            name: val.position,
            workday: val.workday,
            branchId: parseInt(this.data.branchId)
          }));
      } else {
        this.store.dispatch(PositionActions.addPosition({
          name: val.position,
          workday: val.workday,
          branchId: this.data.branchId
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
}
