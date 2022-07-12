import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import {
  selectedAddedPayroll,
  selectedAddingPayroll,
} from '../../../+state/payroll/payroll.selector';
import { Payroll } from '../../../+state/payroll/payroll.interface';

@Component({
  templateUrl: 'dialog-allowance-multiple.component.html',
})
export class DialogAllowanceMultipleComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: UntypedFormGroup;
  submitted = false;
  payrollsSelected: Payroll[] = [];
  isManyPeople = false;
  adding$ = this.store.select(selectedAddingPayroll);

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogAllowanceMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: [this.data?.salary?.title, Validators.required],
      price: [this.data?.salary?.price, Validators.required],
      unit: [this.data.salary?.unit, Validators.required],
      note: [this.data?.salary?.note],
      month: [
        this.datePipe.transform(this.data.createdAt, 'yyyy-MM'),
        Validators.required,
      ],
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
    if (this.payrollsSelected.length === 0) {
      return this.snackBar.open('Chưa chọn nhân viên', '', { duration: 1500 });
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
      payrollIds: this.payrollsSelected.map((e) => e.id),
    };
    this.store.dispatch(
      PayrollAction.addSalary({
        salary: salary,
        isTimesheet: this.data?.isTimesheet,
      })
    );
    this.store.pipe(select(selectedAddedPayroll)).subscribe((added) => {
      if (added) {
        this.dialogRef.close({
          datetime: value.month,
          title: value.title,
        });
      }
    });
  }

  pickPayroll(payrolls: Payroll[]) {
    this.payrollsSelected = [...payrolls];
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
