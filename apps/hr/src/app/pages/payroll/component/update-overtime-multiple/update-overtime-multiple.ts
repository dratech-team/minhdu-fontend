import { Component, Inject, OnInit } from '@angular/core';
import { SalaryService } from '../../service/salary.service';
import { UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'update-overtime-multiple.html'
})
export class UpdateOvertimeMultiple implements OnInit {
  datetimeControl = new UntypedFormControl();
  timesControl = new UntypedFormControl();
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;

  constructor(
    private readonly salaryService: SalaryService,
    private readonly datePipe: DatePipe,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<UpdateOvertimeMultiple>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit() {
    this.firstDayInMonth = this.datePipe.transform(
      getFirstDayInMonth(new Date(this.data.createdAt)), 'yyyy-MM-dd');
    this.lastDayInMonth = this.datePipe.transform(
      getLastDayInMonth(new Date(this.data.createdAt)), 'yyyy-MM-dd');
  }

  onSubmit() {
    this.salaryService.updateMultipleSalaryOvertime(
      {
        salaryIds: this.data.salaryIds,
        datetime: this.datetimeControl.value,
        times: this.timesControl.value
      }
    ).subscribe(val => {
      if (val) {
        this.snackbar.open(val.message, '', { duration: 1500 });
        this.dialogRef.close(
          {
            datetime: this.datetimeControl.value,
          });
      }
    });
  }
}
