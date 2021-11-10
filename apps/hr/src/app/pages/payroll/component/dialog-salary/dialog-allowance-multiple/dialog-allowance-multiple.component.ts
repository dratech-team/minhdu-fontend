import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, PayrollEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { selectedAddedPayroll } from '../../../+state/payroll/payroll.selector';


@Component({
  templateUrl: 'dialog-allowance-multiple.component.html'
})
export class DialogAllowanceMultipleComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  employeeIds: number[] = [];
  isManyPeople = false;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogAllowanceMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      unit: ['', Validators.required],
      note: [],
      month: []
    });
  }

  get chekValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if(this.employeeIds.length === 0){
      this.snackBar.open('Chưa chọn nhân viên', '', {duration: 1500})
    }
    const value = this.formGroup.value;
    const salary = {
      title: value.title,
      price:
        typeof value.price === 'string'
          ? Number(value.price.replace(this.numberChars, ''))
          : value.price,
      type: SalaryTypeEnum.ALLOWANCE,
      rate: 1,
      datetime: new Date(value.month),
      note: value.note,
      unit: value.unit ? value.unit : undefined,
      employeeIds: this.employeeIds
    };
    this.store.dispatch(
      PayrollAction.addSalary({
        salary: salary,
        isTimesheet: this.data?.isTimesheet
      })
    );
    this.store.pipe(select(selectedAddedPayroll)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });

  }


  pickEmployees(employeeIds: number[]) {
    this.employeeIds = employeeIds;
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
}
