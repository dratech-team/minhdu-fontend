import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { selectedAddedPayroll } from '../../+state/payroll/payroll.selector';


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
  unitHour = false;
  employeeIds: number[] = [];
  isManyPeople = false;

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
    { title: 'Về Sớm', unit: this.datetimeUnit.MINUTE, type: this.type.ABSENT }
  ];
  //Dummy data select các buổi trong ngày
  titleSession = [
    { title: 'buổi sáng', type: PartialDayEnum.MORNING },
    { title: 'buổi chiều', type: PartialDayEnum.AFTERNOON },
    { title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY }
  ];

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      datetime: ['', Validators.required],
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
    console.log(this.formGroup);
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.formGroup.value.unit === DatetimeUnitEnum.MINUTE &&
      this.formGroup.value.times == 0 && this.formGroup.value.minutes == 0) {
      this.snackBar.openFromComponent(SnackBarComponent,
        {
          data: { content: 'thơi gian phải lớn hơn 0' },
          panelClass: ['background-snackbar-validate'],
          duration: 2500
        });
      return;
    }

    const value = this.formGroup.value;
    const salary = {
      title: this.titleAbsents[this.selectedIndex]?.title,
      type: this.type.ABSENT,
      rate: value.rate,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      forgot: value.forgot,
      note: value.note,
      unit: value.unit ? value.unit : this.titleAbsents[this.selectedIndex]?.unit,
      times: value.times,
      employeeIds: this.employeeIds.length > 0 ? this.employeeIds : undefined
    };
    if(this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.DAY && typeof value.partialDay !== 'number' ){
      return this.snackBar.open('Chưa chọn buổi','', {duration:2000})
    }
    if(this.employeeIds.length === 0){
      return this.snackBar.open('Chưa chọn nhân viên','', {duration:2000})
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
    }
    this.store.dispatch(PayrollAction.addSalary({
      salary: salary
    }));
    this.store.pipe(select(selectedAddedPayroll)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });

  }

  onSelectAbsent(index: number) {
    this.selectedIndex = index;
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
