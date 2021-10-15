import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../../template/+state/template-overtime/template-overtime.action';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TemplateOvertime } from '../../../template/+state/template-overtime/template-overtime.interface';

@Component({
  templateUrl: 'dialog-overtime.component.html'
})

export class DialogOvertimeComponent implements OnInit {
  datetimeUnitEnum = DatetimeUnitEnum;
  titleOvertimes = new FormControl();
  onAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  price!: number;
  title!: string;
  unit?: DatetimeUnitEnum;
  rate!: number;
  times?: number;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogOvertimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    if (this.data.isUpdate && this.data.salary.allowance) {
      this.onAllowanceOvertime = true;
    }
    this.price = this.data?.salary?.price;
    this.unit = this.data?.salary?.unit;
    this.times = this.data?.salary?.times;
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      {
        positionId: this.data?.payroll ? this.data?.payroll.employee?.position?.id : '',
        unit: this.data?.salary ? this.data?.salary.unit : ''
      }));
    if (this.data.isUpdate) {
      this.formGroup = this.formBuilder.group({
        datetime: [
          this.datePipe.transform(
            this.data.salary.datetime, 'yyyy-MM-dd')],
        note: [this.data.salary.note],
        times: [this.data.salary.times],
        days: [this.data.salary.times],
        priceAllowance: [this.data.salary.allowance?.price],
        titleAllowance: [this.data.salary.allowance?.title]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        datetime: [undefined],
        month: [undefined],
        note: [''],
        times: [1],
        days: [1],
        priceAllowance: [],
        titleAllowance: []
      });
    }

    this.templateOvertime$ = combineLatest([
      this.titleOvertimes.valueChanges.pipe(startWith('')),
      this.store.pipe(select(selectorAllTemplate))
    ]).pipe(
      map(([titleOvertime, TempLateOvertimes]) => {
        if (titleOvertime) {
          return TempLateOvertimes.filter((e) => {
            return e.title.toLowerCase().includes(titleOvertime?.toLowerCase());
          });
        } else {
          return TempLateOvertimes;
        }
      })
    );
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
      title: this.title || this.data?.salary?.title,
      price: this.price || this.data?.salary?.price,
      type: this.data.type,
      rate: this.rate || this.data?.salary?.rate,
      times: this.unit === this.datetimeUnitEnum.DAY && value.days > 1 ? value.days : value.times,
      datetime: value.days <= 1  && value.datetime ? new Date(value.datetime) : undefined,
      note: value.note,
      unit: this.unit || undefined,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : this.data.salary.payrollId
    };
    if (this.onAllowanceOvertime) {
      Object.assign(salary, {
        allowance:
          {
            title: value.titleAllowance,
            price: typeof value.priceAllowance === 'string'
              ? Number(value.priceAllowance.replace(this.numberChars, ''))
              : value.priceAllowance
          }
      });
    }
    if (this.data.isUpdate) {
      if (!this.onAllowanceOvertime && this.data.salary.allowance) {
        this.store.dispatch(PayrollAction.deleteSalary(
          { id: this.data.salary.allowance.id, PayrollId: this.data.salary.payrollId }));
      }
      this.unit = this.data.salary.unit;
      this.title = this.data.salary.title;
      this.store.dispatch(PayrollAction.updateSalary({
        payrollId: this.data.salary.payrollId, id: this.data.salary.id, salary: salary
      }));
    } else {
      if (!this.title) {
        return this.snackBar.open('Chưa chọn loại tăng ca', '', { duration: 2000 });
      }
      if (value.days <=1 && !value.datetime) {
        return this.snackBar.open('Chưa chọn ngày tăng ca', '', { duration: 2000 });
      }
      if (this.unit === DatetimeUnitEnum.HOUR && !value.times) {
        return this.snackBar.open('chưa nhập số giờ tăng ca', '', { duration: 2000 });
      }
      this.store.dispatch(PayrollAction.addSalary({ payrollId: this.data.payroll.id, salary: salary }));
    }
    this.dialogRef.close();
  }

  pickOverTime(data: TemplateOvertime) {
    this.price = data.price;
    this.title = data.title;
    this.rate = data.rate;
    this.unit = data.unit;
  }

  checkAllowanceOvertime() {
    this.onAllowanceOvertime = !this.onAllowanceOvertime;
  }

  selectUnitOvertime(unit?: DatetimeUnitEnum) {
    this.unit = unit;
    this.title = '';
    this.price = 0;
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      {
        positionId: this.data?.payroll ? this.data?.payroll.employee?.position?.id : '',
        unit: this.unit ? this.unit : ''
      }));
    this.titleOvertimes.patchValue('');
  }
}
