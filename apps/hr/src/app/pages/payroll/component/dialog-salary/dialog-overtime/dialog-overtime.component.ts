import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, partialDay, RecipeType, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectorAllTemplate } from '../../../../template/+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../../../template/+state/template-overtime/template-overtime.action';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { startWith } from 'rxjs/operators';
import { TemplateOvertime } from '../../../../template/+state/template-overtime/template-overtime.interface';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../../libs/utils/daytime.until';
import { searchAutocomplete } from '../../../../../../../../../libs/utils/autocomplete.ultil';
import { PartialDayEnum } from '@minhdu-fontend/data-models';

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
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  recipeType = RecipeType;
  partialDay: any;

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

  //Dummy data select các buổi trong ngày
  titleSession = [
    { title: 'buổi sáng', type: PartialDayEnum.MORNING, times: partialDay.PARTIAL },
    { title: 'buổi chiều', type: PartialDayEnum.AFTERNOON, times: partialDay.PARTIAL },
    { title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY, times: partialDay.ALL_DAY }
  ];

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
        positionId: this.data?.payroll ? this.data?.payroll.employee?.position?.id : '',
        unit: this.data?.salary?.unit ? this.data?.salary.unit : ''
      }));
    if (this.data.isUpdate) {
      this.price = this.data.salary.price;
      this.times = this.data.salary.times;
      this.unit = this.data.payroll.employee.recipeType === RecipeType.CT4
      && !this.data.salary.unit ?
        DatetimeUnitEnum.OPTION
        : this.data.salary.unit;
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
        datetime: [this.datePipe.transform(
          this.data.payroll.createdAt, 'yyyy-MM-dd')],
        month: [undefined],
        note: [''],
        times: [1],
        days: [1],
        priceAllowance: [],
        titleAllowance: []
      });
    }

    this.templateOvertime$ = searchAutocomplete(
      this.titleOvertimes.valueChanges.pipe(startWith('')),
      this.store.pipe(select(selectorAllTemplate))
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
      datetime: value.days <= 1 && value.datetime ? new Date(value.datetime) : undefined,
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
    if (this.unit === DatetimeUnitEnum.OPTION) {
      if (this.partialDay) {
        Object.assign(salary, {
          times: this.partialDay.times
        });
      }
      delete salary.unit;
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
      if (value.days <= 1 && !value.datetime) {
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
    if (unit !== DatetimeUnitEnum.OPTION) {
      this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
        {
          positionId: this.data?.payroll ? this.data?.payroll.employee?.position?.id : '',
          unit: this.unit ? this.unit : ''
        }));
      this.titleOvertimes.patchValue('');
    }
  }

  selectPartialDay(partialDay: any) {
    console.log(partialDay);
    this.title = 'Tăng ca ' + partialDay.title;
    this.partialDay = partialDay;
  }
}
