import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'libs/components/src/lib/snackBar/snack-bar.component';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { selectorAllTemplate } from '../../../template/+state/template-overtime/template-overtime.selector';

@Component({
  templateUrl: 'dialog-allowance.component.html'
})
export class DialogAllowanceComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  isAllDay = true;

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

      if(this.data?.salary?.datetime?.start && this.data?.salary?.datetime?.start){
        this.isAllDay = false
      }
      if(this.data.isUpdate){
        this.formGroup = this.formBuilder.group({
          title: [this.data.salary.title, Validators.required],
          unit: [this.data.salary.unit,Validators.required],
          price: [this.data.salary.price, Validators.required],
          note: [this.data.salary.note],
          datetime: [this.data.salary.datetime],
          // times: [this.data.salary.times],
          // start: [this.data.salary.allowance.start],
          // end: [this.data.salary.allowance?.end],
          type: [this.data.type, Validators.required],
          rate: [this.data.salary.rate ? this.data.salary.rate : 1]
        });
      }else{
        this.formGroup = this.formBuilder.group({
          title: ['', Validators.required],
          unit: ['',Validators.required],
          price: ['', Validators.required],
          note: [],
          datetime: [],
          // times: [],
          // start: [],
          // end: [],
          rate: [1]
        });
      }
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    console.log(this.formGroup)
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      title: value.title,
      price:
        typeof value.price === 'string'
          ? Number(value.price.replace(this.numberChars,''))
          : value.price,
      type: this.data.type,
      rate: value.rate,
      // times: value.times ? value.times : undefined,
      datetime: value.unit === 'MONTH' ? value.datetime : undefined,
                    // value.unit === 'DAY' && !this.isAllDay ? {start: value.start, end: value.end}:
                    //     undefined,
      note: value.note,
      unit: value.unit ? value.unit : undefined,
      payrollId: this.data.isUpdate? this.data.salary.id: this.data.payroll.id
    };
    if (this.data.isUpdate) {
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
    this.dialogRef.close(salary);
  }

  changeDatePicker() {
    this.isAllDay = !this.isAllDay;
  }
}
