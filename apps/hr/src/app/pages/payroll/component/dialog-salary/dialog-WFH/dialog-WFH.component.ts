import {DatePipe} from '@angular/common';
import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {ConvertBooleanFrontEnd, DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {selectedAddedPayroll} from '../../../+state/payroll/payroll.selector';
import {AppState} from '../../../../../reducers';
import * as moment from 'moment';
import {getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {SalaryService} from '../../../service/salary.service';

@Component({
  templateUrl: 'dialog-WFH.component.html'
})
export class DialogWFHComponent implements OnInit {
  @ViewChild('titleAbsent') titleAbsent!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  selectedIndex?: number;
  unitMinute = false;
  unitAbsent = false;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  salariesSelected: SalaryPayroll[] = [];
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogWFHComponent>,
    private readonly snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        title: [this.data.salary.title, Validators.required],
        datetime: [
          this.datePipe.transform(this.data.salary?.datetime, 'yyyy-MM-dd')
        ],
        note: [this.data.salary?.note],
      });
    } else {
      this.firstDayInMonth = this.datePipe.transform(
        getFirstDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');
      this.lastDayInMonth = this.datePipe.transform(
        getLastDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');
      this.formGroup = this.formBuilder.group({
        title: ['', Validators.required],
        startedAt: [
          this.datePipe.transform(
            this.data.payroll.createdAt, 'yyyy-MM-dd')
          , Validators.required],
        endedAt: [
          this.datePipe.transform(
            this.data.payroll.createdAt, 'yyyy-MM-dd')
          , Validators.required],
        note: [],
      });
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;
    const salary = {
      title: value.title,
      type: SalaryTypeEnum.WFH,
      note: value.note,
      unit: DatetimeUnitEnum.DAY,
      payrollId: this.data.payroll.id
    };
    if (this.data.isUpdate) {
      Object.assign(salary, {
        datetime: value.datetime
      })
      this.store.dispatch(
        PayrollAction.updateSalary({
          id: this.data.salary.id,
          payrollId: this.data.salary.payrollId,
          salary: salary
        })
      );
    } else {
      if (moment(value.startedAt).format('YYYY-MM-DD')
        === moment(value.endedAt).format('YYYY-MM-DD')){
        console.log(value.startedAt)
        Object.assign(salary, {
          datetime: value.startedAt,
        })
      }else{
        Object.assign(salary, {
          startedAt:moment(value.startedAt).format('YYYY-MM-DD'),
          endedAt: moment(value.endedAt).format('YYYY-MM-DD'),
        })
      }
        this.store.dispatch(
        PayrollAction.addSalary({
          payrollId: this.data.payroll.id,
          salary: salary
        })
      );
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }
}
