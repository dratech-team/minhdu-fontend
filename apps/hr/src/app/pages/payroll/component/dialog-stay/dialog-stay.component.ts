import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayrollAction } from '../../+state/payroll/payroll.action';

@Component({
  templateUrl: 'dialog-stay.component.html'
})
export class DialogStayComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  indexTitle = 0;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogStayComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
    //FIXME
    if (this.data.salary)
      this.indexTitle = this.salariesStay.indexOf(this.data?.salary?.title);
    this.formGroup = this.formBuilder.group({
      price: [this.data?.salary?.price, Validators.required],
      rate: [1, Validators.required]
    });

  }

  get f() {
    return this.formGroup.controls;
  }

//FIXME
  get salariesStay() {
    return ['Phụ cấp ở lại', 'Phụ cấp điện thoại', 'Phụ cấp khác', 'Phụ cấp tín nhiệm'];
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      title: this.salariesStay[this.indexTitle],
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
      type: this.data.type,
      rate: value.rate,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined
    };
    if (this.data.salary) {
      this.store.dispatch(PayrollAction.updateSalary({
        payrollId: this.data.salary.payrollId, id: this.data.salary.id, salary: salary
      }));
    } else {
      this.store.dispatch(PayrollAction.addSalary({ payrollId: this.data.payrollId, salary: salary }));
    }
    this.dialogRef.close(salary);
  }

  setValueTitle(value: number) {
    this.indexTitle = value;
  }
}
