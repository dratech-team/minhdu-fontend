import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {RouteActions} from '../../+state/route.Actions';
import {DatePipe} from '@angular/common';

@Component({
  templateUrl: 'complete-route-dialog.component.html',
})
export class CompleteRouteDialogComponent implements OnInit {
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
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
