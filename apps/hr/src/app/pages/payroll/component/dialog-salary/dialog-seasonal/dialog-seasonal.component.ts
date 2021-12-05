import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { AppState } from '../../../../../reducers';
import { selectedAddedPayroll } from '../../../+state/payroll/payroll.selector';
import { Role } from '../../../../../../../../../libs/enums/hr/role.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateOvertimeAction } from '../../../../template/+state/template-overtime/template-overtime.action';
import { TemplateOvertime } from '../../../../template/+state/template-overtime/template-overtime.interface';
import { selectorAllTemplate } from '../../../../template/+state/template-overtime/template-overtime.selector';
import { startWith } from 'rxjs/operators';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../../libs/utils/daytime.until';
import { searchAutocomplete } from '../../../../../../../../../libs/utils/orgchart.ultil';

@Component({
  templateUrl: 'dialog-seasonal.component.html'
})
export class DialogSeasonalComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetime = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  roleEnum = Role;
  role = localStorage.getItem('role');
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  title!: string;
  titleOvertimes = new FormControl();
  checkTemplate = false;
  onAllowanceOvertime = false;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogSeasonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    this.firstDayInMonth = this.datePipe.transform(
      getFirstDayInMonth(new Date(this.data?.payroll?.createdAt)), 'yyyy-MM-dd');
    this.lastDayInMonth = this.datePipe.transform(
      getLastDayInMonth(new Date(this.data?.payroll?.createdAt)), 'yyyy-MM-dd');
    if (this.data.isUpdate && this.data.salary.allowance) {
      this.onAllowanceOvertime = true;
    }

    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      {
        positionId: this.data?.payroll.employee?.position?.id,
        unit: DatetimeUnitEnum.HOUR
      }));
    if (this.data.isUpdate) {
      this.checkTemplate = true
      this.formGroup = this.formBuilder.group({
        datetime: [this.datePipe.transform(
          this.data.salary.datetime, 'yyyy-MM-dd')],
        price: [this.data.salary.price, Validators.required],
        unit: [this.data.salary.unit, Validators.required],
        times: [this.data.salary.times, Validators.required],
        rate: [this.data.salary.rate],
        priceAllowance: [this.data.salary.allowance?.price],
        titleAllowance: [this.data.salary.allowance?.title]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        datetime: [this.datePipe.transform(
          this.data.payroll.createdAt, 'yyyy-MM-dd')],
        price: ['', Validators.required],
        unit: [DatetimeUnitEnum.DAY, Validators.required],
        times: ['', Validators.required],
        rate: [1],
        priceAllowance: [],
        titleAllowance: []
      });
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.value.unit === DatetimeUnitEnum.HOUR) {
      if (!this.checkTemplate) {
        return this.snackbar.open('Chưa chọn loại tăng ca', '', { duration: 1500 });
      }
      if (!this.datetime) {
        return this.snackbar.open('Chưa nhập ngày tăng ca', '', { duration: 1500 });
      }
    }

    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;

    const salary = {
      datetime: value.unit === DatetimeUnitEnum.HOUR ? value.datetime : undefined,
      title: value.unit === DatetimeUnitEnum.DAY
        ? 'Lương công nhật theo ngày'
        : this.title,
      price: typeof value.price === 'string'
        ? Number(value.price.replace(this.numberChars, ''))
        : value.price,
      rate: value.rate,
      times: value.times,
      unit: value.unit,
      payrollId: this.data.isUpdate ? this.data.salary.payrollId : this.data.payroll.id,
      type: value.unit === DatetimeUnitEnum.HOUR?  SalaryTypeEnum.OVERTIME: SalaryTypeEnum.PART_TIME
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
      this.store.dispatch(
        PayrollAction.updateSalary({
          id: this.data.salary.id,
          payrollId: this.data.salary.payrollId,
          salary: salary
        })
      );
    } else {
      this.store.dispatch(
        PayrollAction.addSalary({
          payrollId: this.data.payroll.id,
          salary: salary
        })
      );
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(val => {
      if (val) {
        this.dialogRef.close();
      }
    });

    this.templateOvertime$ = searchAutocomplete(
      this.titleOvertimes.valueChanges.pipe(startWith('')),
      this.store.pipe(select(selectorAllTemplate))
    );
  }

  pickOverTime(data: TemplateOvertime) {
    this.checkTemplate = !!data;
    this.formGroup.get('price')!.setValue(data.price);
    this.title = data.title;
    this.formGroup.get('rate')!.setValue(data.rate);
  }

  checkAllowanceOvertime() {
    this.onAllowanceOvertime = !this.onAllowanceOvertime;
  }
}
