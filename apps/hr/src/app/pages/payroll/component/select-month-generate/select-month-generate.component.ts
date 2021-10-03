import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { PayrollService } from '../../service/payroll.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'select-month-generate.component.html'
})
export class SelectMonthGenerateComponent implements OnInit {
  formGroup!: FormGroup;
  generating = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SelectMonthGenerateComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly payrollService: PayrollService,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      generate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  submit(): any {
  this.generating = true
    this.payrollService.generate(
      { datetime: this.formGroup.value.generate }
    ).subscribe((res) => {
      this.snackBar.open(res.message, '', { duration: 1000 });
      this.store.dispatch(
        PayrollAction.loadInit({
          skip: 0,
          take: 30
        })
      );
      this.generating = false
      this.dialogRef.close();
    }).unsubscribe();
  }
}
