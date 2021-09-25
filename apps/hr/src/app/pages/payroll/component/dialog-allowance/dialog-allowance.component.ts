import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'libs/components/src/lib/snackBar/snack-bar.component';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';


@Component({
  templateUrl: 'dialog-allowance.component.html',
})
export class DialogAllowanceComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogAllowanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: [this.data?.salary?.title ?? '', Validators.required],
      unit: [this.data?.salary?.unit ? this.data?.salary?.unit : undefined, Validators.required],
      datetime: [
        this.datePipe.transform(
          this.data?.salary?.datetime, 'yyyy-MM-dd')
        , Validators.required],
      times: [this.data?.salary?.times ? this.data?.salary?.times : 0, Validators.required],
      price: [this.data?.salary?.price, Validators.required],
      note: [this.data?.salary?.note],
      type: [this.data?.salary?.type ?
        this.data?.salary?.type : this.data.type
        , Validators.required],
      rate: [1, Validators.required]
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
    if (this.formGroup.value.unit === 'HOUR' &&
      this.formGroup.value.times === 0) {
      this.snackBar.openFromComponent(SnackBarComponent,
        {
          data: { content: 'Số giờ phải lơn hơn 0' },
          panelClass: ['background-snackbar-validate'],
          duration: 2500
        });
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      title: value.title,
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, ''))
        : value.price,
      type: value.type,
      rate: value.rate,
      times: value.times && value !== 0 ? value.times : undefined,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      note: value.note,
      unit: value.unit ? value.unit : undefined,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined
    };
    if (this.data.salary) {
      this.store.dispatch(PayrollAction.updateSalary({
        id: this.data.salary.id, payrollId:
        this.data.payroll.id, salary: salary
      }));
    } else {
      this.store.dispatch(PayrollAction.addSalary({ payrollId: this.data.payroll.id, salary: salary }));
    }
    this.dialogRef.close(salary);
  }
}
