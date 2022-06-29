import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'dialog-datapicker.html',
})
export class DialogDatePickerComponent {
  formGroup!: UntypedFormGroup;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly dialogRef: MatDialogRef<DialogDatePickerComponent>
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      day: [
        this.datePipe.transform(
          this.data?.dayInit ? this.data.dayInit : new Date(),
          'yyyy-MM-dd'
        ),
      ],
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
    this.dialogRef.close({ day: this.formGroup.value.day });
  }
}
