import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { AppState } from '../../../../../reducers';
import { selectedAddedPayroll } from '../../../+state/payroll/payroll.selector';
import { TemplateSalaryAction } from '../../../../template/+state/teamlate-salary/template-salary.action';
import { selectorAllTemplate } from '../../../../template/+state/teamlate-salary/template-salary.selector';
import { map } from 'rxjs/operators';
import { Role } from '../../../../../../../../../libs/enums/hr/role.enum';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SalaryMultipleEmployeeService } from '../../../service/salary-multiple-employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'dialog-seasonal.component.html'
})
export class DialogSeasonalComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  roleEnum = Role;
  role = localStorage.getItem('role');


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

    if (this.data.isUpdate) {
      this.formGroup = this.formBuilder.group({
        price: [this.data.salary.price, Validators.required],
        unit: [this.data.salary.unit, Validators.required],
        times: [this.data.salary.times, Validators.required]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        price: ['', Validators.required],
        unit: ['DAY', Validators.required],
        times: ['', Validators.required]
      });
    }
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
      title: value.unit === DatetimeUnitEnum.DAY
        ? 'Lương công nhật theo ngày'
        : 'Lương công nhật theo giờ',
      price: typeof value.price === 'string'
        ? Number(value.price.replace(this.numberChars, ''))
        : value.price,
      times: value.times,
      unit: value.unit,
      payrollId: this.data.isUpdate ? this.data.salary.payrollId : this.data.payroll.id,
      type: SalaryTypeEnum.PART_TIME
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
    this.store.pipe(select(selectedAddedPayroll)).subscribe(val => {
      if (val) {
        this.dialogRef.close();
      }
    });

  }
}
