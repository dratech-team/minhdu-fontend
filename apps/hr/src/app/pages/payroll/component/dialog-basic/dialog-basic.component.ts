import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { selectorAllTemplate } from '../../+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../+state/template-overtime/template-overtime.action';
import { TemplateOvertime } from '../../+state/template-overtime/template-overtime.interface';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import * as lodash from 'lodash';
import { map } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';

@Component({
  templateUrl: 'dialog-basic.component.html',
})
export class DialogBasicComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogBasicComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      price: [this.data?.salary?.price, Validators.required],
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
    const value = this.formGroup.value;
    const salary = {
      title: value.type === this.type.BASIC_ISNURANCE ?
        'Lương cơ bản trước bảo hiểm' : 'Lương cơ bản',
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
      rate: value.rate,
      payrollId:this.data?.payroll?.id || undefined,
      type:this.data.type
    };
    if (this.data.salary) {
      console.log(this.data.payroll.id)
      this.store.dispatch(PayrollAction.updateSalary({
        id: this.data.salary.id, payrollId:
        this.data.payroll.id , salary: salary }));
    } else {
      this.store.dispatch(PayrollAction.addSalary({ payrollId: this.data.payroll.id , salary: salary }));
    }
    this.dialogRef.close();
  }
}
