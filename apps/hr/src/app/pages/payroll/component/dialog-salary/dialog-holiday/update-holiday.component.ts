import {DatePipe} from '@angular/common';
import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {ConvertBooleanFrontEnd, DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {selectedAddedPayroll} from '../../../+state/payroll/payroll.selector';
import {AppState} from '../../../../../reducers';
import * as moment from 'moment';
import {getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {SalaryService} from '../../../service/salary.service';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  templateUrl: 'update-holiday.component.html'
})
export class UpdateHolidayComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  formGroup!: UntypedFormGroup;
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly dialogRef: MatDialogRef<UpdateHolidayComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        title: [this.data.salary.title, Validators.required],
        datetime: [
          this.datePipe.transform(this.data.salary?.datetime, 'yyyy-MM-dd')
        ],
        times: [this.data.salary.times],
        rate: [this.data.salary.rate],
        price: [this.data.salary.price],
      });
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      type: SalaryTypeEnum.HOLIDAY,
      rate: value.rate,
      times: value.times,
      datetime: value.datetime,
      payrollId: this.data.payroll.id,
      price:
        typeof value.price === 'string'
          ? Number(value.price.replace(this.numberChars, ''))
          : value.price,
    };
    this.store.dispatch(
      PayrollAction.updateSalary({
        id: this.data.salary.id,
        payrollId: this.data.salary.payrollId,
        salary: salary
      })
    );
    this.store.pipe(select(selectedAddedPayroll)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }
}
