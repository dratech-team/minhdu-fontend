import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { isEqualDatetime } from 'libs/utils/daytime.until';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { selectedAddedPayroll } from '../../+state/payroll/payroll.selector';
import { ShowAlertComponent } from '../../../../../../../../libs/components/src/lib/show-alert/show-alert.component';
import { AppState } from '../../../../reducers';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';

@Component({
  templateUrl: 'dialog-allowance.component.html',
})
export class DialogAllowanceComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  type = SalaryTypeEnum;
  datetimeEnum = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  isAllDay = true;
  isApprentice = false;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogAllowanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    if (
      this.data?.salary?.datetime?.start &&
      this.data?.salary?.datetime?.start
    ) {
      this.isAllDay = false;
    }
    if (this.data.isUpdate) {
      this.formGroup = this.formBuilder.group({
        title: [this.data.salary.title, Validators.required],
        unit: [this.data.salary.unit, Validators.required],
        price: [this.data.salary.price, Validators.required],
        note: [this.data.salary.note],
        datetime: [
          this.data.salary.unit === DatetimeUnitEnum.DAY
            ? this.datePipe.transform(this.data.salary.datetime, 'yyyy-MM-dd')
            : this.datePipe.transform(this.data.salary.datetime, 'yyyy-MM'),
        ],
        times: [this.data.salary.times],
        // start: [this.data.salary.allowance.start],
        // end: [this.data.salary.allowance?.end],
        type: [this.data.type, Validators.required],
        rate: [this.data.salary.rate ? this.data.salary.rate : 1],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: ['', Validators.required],
        unit: ['', Validators.required],
        price: ['', Validators.required],
        note: [],
        datetime: [],
        times: [1],
        // start: [],
        // end: [],
        rate: [1],
      });
    }
  }

  isShowDatePicker() {
    return isEqualDatetime(this.data?.payroll?.employee?.workedAt, this.data?.payroll?.createdAt, 'month');
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      title: value.title,
      price:
        typeof value.price === 'string'
          ? Number(value.price.replace(this.numberChars, ''))
          : value.price,
      type: this.data.type,
      rate: value.rate,
      times: value.times,
      datetime:
        value.unit === 'MONTH' ||
        (value.unit === DatetimeUnitEnum.DAY && value.datetime)
          ? new Date(value.datetime)
          : undefined,
      // value.unit === 'DAY' && !this.isAllDay ? {start: value.start, end: value.end}:
      //     undefined,
      note: value.note,
      unit: value.unit ? value.unit : undefined,
      payrollId: this.data.isUpdate
        ? this.data.salary.id
        : this.data.payroll.id,
    };
    if (this.data.isUpdate) {
      this.store.dispatch(
        PayrollAction.updateSalary({
          id: this.data.salary.id,
          payrollId: this.data.salary.payrollId,
          salary: salary,
        })
      );
    } else {
      this.store.dispatch(
        PayrollAction.addSalary({
          payrollId: this.data.payroll.id,
          salary: salary,
        })
      );
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  changeDatePicker() {
    this.isAllDay = !this.isAllDay;
  }

  showAlert() {
    if (!this.isApprentice) {
      this.dialog.open(ShowAlertComponent, {
        width: 'fit-content',
        disableClose: true,
        data: {
          content: 'Tính từ ngày chỉ được sử dụng cho phụ cấp sau khi thử việc',
        },
      });
      this.isApprentice = true;
    }
  }
}
