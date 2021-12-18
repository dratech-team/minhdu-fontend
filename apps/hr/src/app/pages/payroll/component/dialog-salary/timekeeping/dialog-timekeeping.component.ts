import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee, PartialDayEnum } from '@minhdu-fontend/data-models';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { selectedAddedPayroll } from '../../../+state/payroll/payroll.selector';
import { getFirstDayInMonth } from '../../../../../../../../../libs/utils/daytime.until';


@Component({
  templateUrl: 'dialog-timekeeping.component.html'
})
export class DialogTimekeepingComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  selectedIndex = 0;
  unitMinute = false;
  employeeSelected: Employee[] = [];
  isManyPeople = false;
  tabIndex = 0;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogTimekeepingComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  //DUMMY DATA Không thay đổi thứ tự index hiện tại -> thêm title ở cuối mảng
  titleAbsents = [
    { title: 'Vắng', unit: this.datetimeUnit.DAY, type: this.type.ABSENT },
    { title: 'Không đi làm', unit: this.datetimeUnit.DAY, type: this.type.DAY_OFF },
    { title: 'Đi trễ', unit: this.datetimeUnit.MINUTE, type: this.type.ABSENT },
    { title: 'Về Sớm', unit: this.datetimeUnit.MINUTE, type: this.type.ABSENT },
    { title: 'Quên bổ sung công', unit: this.datetimeUnit.TIMES, type: this.type.ABSENT },
    { title: 'Khác', unit: this.datetimeUnit.OTHER, type: this.type.DEDUCTION }
  ];
  //Dummy data select các buổi trong ngày
  titleSession = [
    { title: 'buổi sáng', type: PartialDayEnum.MORNING },
    { title: 'buổi chiều', type: PartialDayEnum.AFTERNOON },
    { title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY }
  ];

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: [],
      price: [],
      datetime: [this.datePipe.transform(this.data.createdAt, 'yyyy-MM-dd'), Validators.required],
      times: [],
      minutes: [],
      rate: [1, Validators.required],
      note: [],
      forgot: [],
      partialDay: []
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
    if (
      (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.OTHER)
    ) {
      if (!value.title) {
        return this.snackBar.open('Chưa nhập tên khấu trừ', '', { duration: 1500 });
      }
      if (!value.price) {
        return this.snackBar.open('Chưa nhập tiền khấu trừ', '', { duration: 1500 });
      }
    }

    if (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.MINUTE &&
      !this.formGroup.value.times && !this.formGroup.value.minutes) {
      return this.snackBar.open('Chưa nhập thời gian', '', { duration: 2000 });
    }

    const salary = {
      title: this.titleAbsents[this.selectedIndex]?.title,
      type: this.titleAbsents[this.selectedIndex]?.type,
      rate: value.rate,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      forgot: value.forgot,
      note: value.note,
      unit: this.titleAbsents[this.selectedIndex].unit ? this.titleAbsents[this.selectedIndex].unit : undefined,
      times: value.times,
      employeeIds: this.employeeSelected.length > 0 ? this.employeeSelected.map(e => e.id) : undefined
    };

    if (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.DAY && typeof value.partialDay !== 'number') {
      return this.snackBar.open('Chưa chọn buổi', '', { duration: 2000 });
    }

    if (this.employeeSelected.length === 0) {
      return this.snackBar.open('Chưa chọn nhân viên', '', { duration: 2000 });
    }

    if (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.DAY) {
      Object.assign(
        salary, {
          title: this.titleAbsents[this.selectedIndex]?.title + ' ' + this.titleSession[value.partialDay]?.title,
          times: this.titleSession[value.partialDay]?.type === PartialDayEnum.ALL_DAY ? 1 : 0.5
        }
      );
    } else {

      Object.assign(
        salary, {
          title: this.titleAbsents[this.selectedIndex]?.title,
          times: value.times ? value.times * 60 + value.minutes : value.minutes
        }
      );
      if (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.TIMES) {
        Object.assign(salary, {
          title: this.titleAbsents[this.selectedIndex]?.title,
          times: value.times
        });
      }
      if (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.OTHER) {
        delete salary.unit;
        Object.assign(salary, {
          title: value.title,
          price: typeof value.price === 'string'
            ? Number(value.price.replace(this.numberChars, ''))
            : value.price,
          datetime: value.datetime ? new Date(value.datetime) : undefined
        });
      }
    }
    this.store.dispatch(PayrollAction.addSalary({
      salary: salary, isTimesheet: this.data?.isTimesheet
    }));
    this.store.pipe(select(selectedAddedPayroll)).subscribe(added => {
      if (added) {
        this.dialogRef.close({
          datetime: value.datetime,
          title: salary.title
        });
      }
    });
  }

  onSelectAbsent(index: number) {
    this.selectedIndex = index;
  }

  pickEmployees(employees: Employee[]) {
    this.employeeSelected = [...employees];
  }

  nextTab(tab: any) {
    this.tabIndex = tab._selectedIndex + 1;

  }

  previousTab(tab: any) {
    this.tabIndex = tab._selectedIndex - 1;
  }
}
