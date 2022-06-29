import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Salary, SalaryPayroll } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'classify-overtime.component.html',
})
export class ClassifyOvertimeComponent {
  dateTimeUnit = DatetimeUnitEnum;
  constructor(
    private readonly dialogRef: MatDialogRef<ClassifyOvertimeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { type: 'SELECT' | 'REMOVE'; salary: Salary; title: string }
  ) {}

  onSubmit(type: 'ONE' | 'ALL') {
    this.dialogRef.close(type);
  }
}
