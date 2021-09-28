import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../../template/+state/template-overtime/template-overtime.action';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TemplateOvertime } from '../../../template/+state/template-overtime/template-overtime.interface';


@Component({
  templateUrl: 'dialog-overtime.component.html'
})

export class DialogOvertimeComponent implements OnInit {
  titleOvertimes = new FormControl();
  onAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  employeeIds: number[] = [];
  allowEmpIds: number[] = [];
  price!: number;
  title!: string;
  unit!: string;
  rate!: number;
  times?: number;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  employee$ = this.store.pipe(select(selectorAllEmployee));
  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  searchInit: any;

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

//TODO CHƯA VALIDATE ĐƯỢC CÁC TRƯỜNG LIÊN QUAN ĐẾN AUTOCOMPLETE
  ngOnInit(): void {
    this.price = this.data?.salary?.price;
    this.unit = this.data?.salary?.unit;
    this.times = this.data?.salary?.times;
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      {
        positionId: this.data?.payroll ? this.data?.payroll.employee?.position?.id : '',
        unit: this.data?.salary ? this.data?.salary.unit : ''
      }));
    this.formGroup = this.formBuilder.group({
      datetime: [
        this.datePipe.transform(
          this.data?.salary?.datetime, 'yyyy-MM-dd')
        , Validators.required],
      note: [this.data?.salary?.note],
      times: [this.data?.salary?.times],
      priceAllowance: [this.data?.salary?.allowance?.price],
      titleAllowance: [this.data?.salary?.allowance?.title]
    });
    this.templateOvertime$ = combineLatest([
      this.titleOvertimes.valueChanges,
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

  pickEmployees(employeeIds: number []): any {
    this.employeeIds = employeeIds;
    console.log(employeeIds)
  }
  pickAllowance(allowEmpIds: number[]) {
    this.allowEmpIds = allowEmpIds;
    console.log(allowEmpIds)
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
      times: value.times,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      note: value.note,
      unit: this.unit || undefined,
      employeeIds: this.employeeIds.length > 0 ? this.employeeIds : undefined,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined,
      allowEmpIds: this.allowEmpIds.length > 0 ? this.allowEmpIds : undefined,
      allowance: value.titleAllowance && value.priceAllowance ?
        {
          title: value.titleAllowance,
          price: typeof value.priceAllowance === 'string'
            ? Number(value.priceAllowance.replace(this.numberChars, ''))
            : value.priceAllowance
        } : undefined,
    };
    if (this.data.salary) {
      this.unit = this.data.salary.unit;
      this.title = this.data.salary.title;
      this.store.dispatch(PayrollAction.updateSalary({
        payrollId: this.data.payroll.id, id: this.data.salary.id, salary: salary
      }));
    } else {
      this.store.dispatch(PayrollAction.addSalary({ payrollId: this.data.payrollId, salary: salary }));
    }
    this.dialogRef.close();
  }

  tabChanged($event: MatTabChangeEvent) {
    switch ($event.index) {
      case 2:
        this.isManyPeople = true;
        break;
      default:
        this.isManyPeople = false;
    }
  }

  pickOverTime(data: TemplateOvertime) {
    this.price = data.price;
    this.title = data.title;
    this.rate = data.rate;
    this.unit = data.unit;
    this.formGroup.value.times = 0;
    this.searchInit = { templateId: data.id };
    if (!this.data?.payroll) {
      this.store.dispatch(EmployeeAction.loadInit({ templateId: data.id }));
    }
  }
  checkAllowanceOvertime() {
    this.onAllowanceOvertime = !this.onAllowanceOvertime
  }


}
