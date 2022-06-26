import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {RouteActions} from '../../+state';
import {DatePipe} from '@angular/common';

@Component({
  templateUrl: 'complete-route-dialog.component.html',
})
export class CompleteRouteDialogComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly dialogRef: MatDialogRef<CompleteRouteDialogComponent>,
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      endedAt: [
        this.datePipe.transform(this.data?.route?.endedAt ?
          this.data.route.endedAt : new Date(), 'yyyy-MM-dd'),
      ]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
      this.store.dispatch(
        RouteActions.update({updates: {endedAt: this.formGroup.value.endedAt}, id: this.data.route.id})
      );
    this.dialogRef.close();
  }
}
